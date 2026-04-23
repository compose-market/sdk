/**
 * Session-events SSE resource.
 *
 * Subscribes to `/api/session/events?userAddress=<address>&chainId=<chainId>`
 * and yields typed `session-active` / `session-expired` events as they arrive.
 *
 * Each event is additionally dispatched to the SDK event bus so application
 * code can centralise listeners on `sdk.events.on("sessionActive", ...)` and
 * `sdk.events.on("sessionExpired", ...)` without plumbing the iterator
 * manually.
 *
 * The iterator auto-reconnects transparently on network errors using the
 * retry policy configured on the HTTP client; callers cancel via the
 * provided `AbortSignal`.
 */

import type { ComposeEventBus } from "../events.js";
import type { HttpClient } from "../http.js";
import type {
    SessionActiveEvent,
    SessionEvent,
    SessionExpiredEvent,
} from "../types/index.js";
import { ComposeError } from "../errors.js";
import { parseSSEStream, type SSEFrame } from "../streaming/sse.js";

export interface SessionEventsOptions {
    userAddress: string;
    chainId: number;
    signal?: AbortSignal;
    /** Max delay between reconnect attempts, in milliseconds. Default 10_000. */
    reconnectMaxDelayMs?: number;
}

/**
 * Drive a raw SSE subscription to `/api/session/events` and yield one event
 * at a time. The generator terminates only when the caller aborts the signal
 * or when a terminal `session-expired` event is emitted for the requested
 * `(userAddress, chainId)` tuple (a terminal signal from the server side).
 */
export class SessionEventsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly events: ComposeEventBus,
    ) {}

    subscribe(opts: SessionEventsOptions): AsyncIterable<SessionEvent> {
        const self = this;
        return {
            [Symbol.asyncIterator](): AsyncIterator<SessionEvent> {
                return self.createIterator(opts);
            },
        };
    }

    private createIterator(opts: SessionEventsOptions): AsyncIterator<SessionEvent> {
        const reconnectMaxDelayMs = Math.max(500, opts.reconnectMaxDelayMs ?? 10_000);
        let closed = false;
        let attempt = 0;
        let pending: IteratorResult<SessionEvent> | null = null;
        // Cancellation is routed through `opts.signal` into `parseSSEStream`;
        // we don't hold a reader handle here, so the iterator just flips the
        // `closed` flag and lets the in-flight `asResponse()` / parseSSEStream
        // receive the abort.
        const abortHandler = () => { closed = true; };
        opts.signal?.addEventListener("abort", abortHandler, { once: true });

        const poll = async (): Promise<IteratorResult<SessionEvent>> => {
            while (!closed) {
                try {
                    const response = await this.client.request<unknown>({
                        method: "GET",
                        path: "/api/session/events",
                        query: {
                            userAddress: opts.userAddress,
                            chainId: opts.chainId,
                        },
                        signal: opts.signal,
                        expectStream: true,
                        doNotRetry: true,
                        headers: {
                            extra: { Accept: "text/event-stream" },
                        },
                    }).asResponse();

                    if (!response.body) {
                        throw new ComposeError({
                            code: "upstream_error",
                            message: "session events stream had no body",
                        });
                    }

                    attempt = 0;
                    return await this.consumeStream(response.body, opts);
                } catch (err) {
                    if (closed) break;
                    if (opts.signal?.aborted) {
                        closed = true;
                        break;
                    }
                    attempt += 1;
                    const delay = Math.min(500 * (2 ** (attempt - 1)), reconnectMaxDelayMs);
                    await new Promise<void>((resolve) => setTimeout(resolve, delay));
                    if (closed || opts.signal?.aborted) break;
                    // fall through and reconnect
                }
            }
            opts.signal?.removeEventListener("abort", abortHandler);
            return { done: true, value: undefined };
        };

        return {
            next: async (): Promise<IteratorResult<SessionEvent>> => {
                if (pending) {
                    const result = pending;
                    pending = null;
                    return result;
                }
                return poll();
            },
            return: async (): Promise<IteratorResult<SessionEvent>> => {
                closed = true;
                opts.signal?.removeEventListener("abort", abortHandler);
                return { done: true, value: undefined };
            },
            throw: async (err): Promise<IteratorResult<SessionEvent>> => {
                closed = true;
                opts.signal?.removeEventListener("abort", abortHandler);
                throw err;
            },
        };
    }

    /**
     * Read until a named event arrives, yield it, emit on the bus, and
     * return. The outer iterator loops back to re-open the stream, preserving
     * the read-one-then-reconnect cadence we want for cross-tab event
     * semantics (no orphaned bytes when the consumer pauses).
     */
    private async consumeStream(
        body: ReadableStream<Uint8Array>,
        opts: SessionEventsOptions,
    ): Promise<IteratorResult<SessionEvent>> {
        const parser = parseSSEStream(body, { signal: opts.signal });
        let nextResult: IteratorResult<SessionEvent> | null = null;

        try {
            for await (const frame of parser) {
                const parsed = parseSessionEventFrame(frame);
                if (!parsed) continue;

                if (parsed.type === "session-active") {
                    this.events.emit("sessionActive", parsed);
                } else {
                    this.events.emit("sessionExpired", parsed);
                }

                if (nextResult === null) {
                    nextResult = { done: false, value: parsed };
                    return nextResult;
                }
            }
        } finally {
            try { body.cancel(); } catch { /* best-effort */ }
        }

        // Stream ended without yielding (e.g. server closed). Signal upstream
        // to reconnect rather than terminate.
        throw new ComposeError({ code: "upstream_error", message: "session events stream closed without emitting a frame" });
    }
}

function parseSessionEventFrame(frame: SSEFrame): SessionEvent | null {
    if (frame.event === "session-active") {
        try {
            const data = JSON.parse(frame.data) as Record<string, unknown>;
            return {
                type: "session-active",
                userAddress: String(data.userAddress ?? ""),
                chainId: Number(data.chainId ?? 0),
                expiresAt: typeof data.expiresAt === "number" ? data.expiresAt : undefined,
                budgetLimit: coerceWeiString(data.budgetLimit),
                budgetUsed: coerceWeiString(data.budgetUsed),
                budgetLocked: coerceWeiString(data.budgetLocked),
                budgetRemaining: coerceWeiString(data.budgetRemaining),
                timestamp: typeof data.timestamp === "number" ? data.timestamp : undefined,
            } satisfies SessionActiveEvent;
        } catch {
            return null;
        }
    }

    if (frame.event === "session-expired") {
        try {
            const data = JSON.parse(frame.data) as Record<string, unknown>;
            return {
                type: "session-expired",
                userAddress: String(data.userAddress ?? ""),
                chainId: Number(data.chainId ?? 0),
                reason: typeof data.reason === "string" ? data.reason : undefined,
                message: typeof data.message === "string" ? data.message : undefined,
                action: typeof data.action === "string" ? data.action : undefined,
                expiresAt: typeof data.expiresAt === "number" ? data.expiresAt : undefined,
                timestamp: typeof data.timestamp === "number" ? data.timestamp : undefined,
            } satisfies SessionExpiredEvent;
        } catch {
            return null;
        }
    }

    return null;
}

function coerceWeiString(value: unknown): string | undefined {
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return undefined;
}

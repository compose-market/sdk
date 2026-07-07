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
    ComposeAlert,
    SessionActiveEvent,
    SessionEvent,
    SessionExpiredEvent,
    SessionLeaseEvent,
} from "../types/index.js";
import { Error as SdkError } from "../errors.js";
import { parseSSEStream, type SSEFrame } from "../streaming/sse.js";

export interface SessionEventsOptions {
    userAddress: string;
    chainId: number;
    signal?: AbortSignal;
    /** Max delay between reconnect attempts, in milliseconds. Default 10_000. */
    reconnectMaxDelayMs?: number;
}

type StreamResult =
    | { kind: "terminal" }
    | { kind: "rotate"; retryAfterMs?: number }
    | { kind: "closed" };

interface Waiter {
    resolve: (result: IteratorResult<SessionEvent>) => void;
    reject: (err: unknown) => void;
}

interface Sink {
    queue: SessionEvent[];
    waiter: Waiter | null;
    closed: boolean;
    error: unknown;
    abort: (() => void) | null;
}

interface Hub {
    key: string;
    controller: AbortController;
    sinks: Set<Sink>;
}

/**
 * Drive a raw SSE subscription to `/api/session/events` and yield one event
 * at a time. The generator terminates only when the caller aborts the signal
 * or when a terminal `session-expired` event is emitted for the requested
 * `(userAddress, chainId)` tuple (a terminal signal from the server side).
 */
export class SessionEventsResource {
    private readonly hubs = new Map<string, Hub>();

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
        if (opts.signal?.aborted) {
            return {
                next: async () => ({ done: true, value: undefined }),
                return: async () => ({ done: true, value: undefined }),
                throw: async (err) => { throw err; },
            };
        }

        const key = this.key(opts);
        const hub = this.hubs.get(key) ?? this.start(key, opts);
        const sink: Sink = {
            queue: [],
            waiter: null,
            closed: false,
            error: null,
            abort: null,
        };

        const cleanup = () => {
            if (sink.abort) {
                opts.signal?.removeEventListener("abort", sink.abort);
                sink.abort = null;
            }
        };
        const drop = () => {
            cleanup();
            this.drop(hub, sink);
        };

        sink.abort = drop;
        opts.signal?.addEventListener("abort", drop, { once: true });
        hub.sinks.add(sink);

        return {
            next: async () => this.next(sink),
            return: async () => {
                drop();
                return { done: true, value: undefined };
            },
            throw: async (err) => {
                drop();
                throw err;
            },
        };
    }

    private key(opts: SessionEventsOptions): string {
        return `${opts.userAddress.toLowerCase()}:${opts.chainId}`;
    }

    private start(key: string, opts: SessionEventsOptions): Hub {
        const hub: Hub = {
            key,
            controller: new AbortController(),
            sinks: new Set(),
        };
        this.hubs.set(key, hub);

        queueMicrotask(() => {
            void this.run(hub, opts);
        });

        return hub;
    }

    private async run(hub: Hub, opts: SessionEventsOptions): Promise<void> {
        try {
            for await (const event of this.stream({ ...opts, signal: hub.controller.signal })) {
                this.publish(hub, event);
            }
            this.close(hub);
        } catch (err) {
            if (hub.controller.signal.aborted) {
                this.close(hub);
                return;
            }
            this.fail(hub, err);
        } finally {
            if (this.hubs.get(hub.key) === hub) {
                this.hubs.delete(hub.key);
            }
        }
    }

    private publish(hub: Hub, event: SessionEvent): void {
        for (const sink of Array.from(hub.sinks)) {
            if (sink.closed) continue;
            if (sink.waiter) {
                const waiter = sink.waiter;
                sink.waiter = null;
                waiter.resolve({ done: false, value: event });
            } else {
                sink.queue.push(event);
            }
        }
    }

    private close(hub: Hub): void {
        for (const sink of Array.from(hub.sinks)) {
            this.finish(hub, sink);
        }
    }

    private fail(hub: Hub, err: unknown): void {
        for (const sink of Array.from(hub.sinks)) {
            sink.error = err;
            if (sink.waiter) {
                const waiter = sink.waiter;
                sink.waiter = null;
                waiter.reject(err);
            }
        }
        hub.sinks.clear();
        if (this.hubs.get(hub.key) === hub) {
            this.hubs.delete(hub.key);
        }
    }

    private drop(hub: Hub, sink: Sink): void {
        this.finish(hub, sink);
        if (hub.sinks.size === 0) {
            hub.controller.abort();
            if (this.hubs.get(hub.key) === hub) {
                this.hubs.delete(hub.key);
            }
        }
    }

    private finish(hub: Hub, sink: Sink): void {
        if (sink.closed) return;
        sink.closed = true;
        sink.queue = [];
        hub.sinks.delete(sink);
        if (sink.waiter) {
            const waiter = sink.waiter;
            sink.waiter = null;
            waiter.resolve({ done: true, value: undefined });
        }
    }

    private async next(sink: Sink): Promise<IteratorResult<SessionEvent>> {
        if (sink.queue.length > 0) {
            return { done: false, value: sink.queue.shift() as SessionEvent };
        }
        if (sink.error) {
            throw sink.error;
        }
        if (sink.closed) {
            return { done: true, value: undefined };
        }

        return new Promise<IteratorResult<SessionEvent>>((resolve, reject) => {
            sink.waiter = { resolve, reject };
        });
    }

    private async *stream(opts: SessionEventsOptions): AsyncGenerator<SessionEvent, void, void> {
        const reconnectMaxDelayMs = Math.max(500, opts.reconnectMaxDelayMs ?? 10_000);
        let attempt = 0;

        while (!opts.signal?.aborted) {
            try {
                const request = new AbortController();
                const abortRequest = () => request.abort();
                opts.signal?.addEventListener("abort", abortRequest, { once: true });

                let response: Response;
                try {
                    response = await this.client.request<unknown>({
                        method: "GET",
                        path: "/api/session/events",
                        query: {
                            userAddress: opts.userAddress,
                            chainId: opts.chainId,
                        },
                        signal: request.signal,
                        expectStream: true,
                        doNotRetry: true,
                        headers: {
                            extra: { Accept: "text/event-stream" },
                        },
                    }).asResponse();
                } finally {
                    opts.signal?.removeEventListener("abort", abortRequest);
                }

                if (response.status === 204) {
                    await wait(retryDelayFrom(response) ?? reconnectMaxDelayMs, opts.signal);
                    continue;
                }

                if (!response.body) {
                    throw new SdkError({
                        code: "upstream_error",
                        message: "session events stream had no body",
                    });
                }
                if (opts.signal?.aborted) {
                    try { response.body.cancel(); } catch { /* best-effort */ }
                    return;
                }

                attempt = 0;
                const result = yield* this.consumeStream(response.body, opts);
                if (result.kind === "terminal" || opts.signal?.aborted) {
                    return;
                }
                if (result.kind === "rotate") {
                    await wait(result.retryAfterMs ?? retryDelayFrom(response) ?? reconnectMaxDelayMs, opts.signal);
                    continue;
                }

                throw new SdkError({
                    code: "upstream_error",
                    message: "session events stream closed before session-expired",
                });
            } catch (err) {
                if (opts.signal?.aborted) return;
                attempt += 1;
                const delay = Math.min(500 * (2 ** (attempt - 1)), reconnectMaxDelayMs);
                await wait(delay, opts.signal);
            }
        }
    }

    private async *consumeStream(
        body: ReadableStream<Uint8Array>,
        opts: SessionEventsOptions,
    ): AsyncGenerator<SessionEvent, StreamResult, void> {
        const parser = parseSSEStream(body, { signal: opts.signal });

        try {
            for await (const frame of parser) {
                const alert = parseAlertFrame(frame);
                if (alert) {
                    this.events.emit("alert", alert);
                    continue;
                }

                const parsed = parseSessionEventFrame(frame);
                if (!parsed) continue;

                if (parsed.type === "session-active") {
                    this.events.emit("sessionActive", parsed);
                } else if (parsed.type === "session-expired") {
                    this.events.emit("sessionExpired", parsed);
                }

                yield parsed;

                if (parsed.type === "session-expired") {
                    return { kind: "terminal" };
                }
                if (parsed.type === "session-lease") {
                    return { kind: "rotate", retryAfterMs: parsed.retryAfterMs };
                }
            }
        } finally {
            try { body.cancel(); } catch { /* best-effort */ }
        }

        return { kind: "closed" };
    }
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
    if (signal?.aborted) return Promise.resolve();
    return new Promise((resolve) => {
        const finish = () => {
            signal?.removeEventListener("abort", finish);
            clearTimeout(timer);
            resolve();
        };
        const timer = setTimeout(finish, ms);
        signal?.addEventListener("abort", finish, { once: true });
    });
}

function retryDelayFrom(response: Response): number | null {
    const value = response.headers.get("retry-after");
    if (!value) return null;
    const seconds = Number.parseInt(value, 10);
    return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : null;
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

    if (frame.event === "session-lease") {
        try {
            const data = JSON.parse(frame.data) as Record<string, unknown>;
            return {
                type: "session-lease",
                userAddress: String(data.userAddress ?? ""),
                chainId: Number(data.chainId ?? 0),
                reason: typeof data.reason === "string" ? data.reason as SessionLeaseEvent["reason"] : undefined,
                message: typeof data.message === "string" ? data.message : undefined,
                leaseMs: typeof data.leaseMs === "number" ? data.leaseMs : undefined,
                retryAfterMs: typeof data.retryAfterMs === "number" ? data.retryAfterMs : undefined,
                timestamp: typeof data.timestamp === "number" ? data.timestamp : undefined,
            } satisfies SessionLeaseEvent;
        } catch {
            return null;
        }
    }

    return null;
}

function parseAlertFrame(frame: SSEFrame): ComposeAlert | null {
    if (frame.event !== "compose.alert") return null;

    try {
        const data = JSON.parse(frame.data) as Record<string, unknown>;
        const message = typeof data.message === "string" ? data.message : "";
        const severity = data.severity === "warning" || data.severity === "error" ? data.severity : "info";
        return {
            type: "compose.alert",
            code: typeof data.code === "string" ? data.code : "compose_alert",
            severity,
            source: typeof data.source === "string" ? data.source : "api",
            scope: typeof data.scope === "string" ? data.scope as ComposeAlert["scope"] : "api",
            title: typeof data.title === "string" ? data.title : undefined,
            message,
            userAddress: typeof data.userAddress === "string" ? data.userAddress : undefined,
            chainId: typeof data.chainId === "number" ? data.chainId : undefined,
            timestamp: typeof data.timestamp === "number" ? data.timestamp : undefined,
            metadata: isRecord(data.metadata) ? data.metadata : undefined,
            leaseMs: typeof data.leaseMs === "number" ? data.leaseMs : undefined,
            retryAfterMs: typeof data.retryAfterMs === "number" ? data.retryAfterMs : undefined,
        };
    } catch {
        return null;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceWeiString(value: unknown): string | undefined {
    if (typeof value === "string" && value.length > 0) return value;
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
    return undefined;
}

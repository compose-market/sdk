/**
 * Compose agent runtime stream resource.
 *
 * Subscribes to POST /agent/:wallet/stream on the Compose runtime service
 * and yields typed `AgentRuntimeEvent` values. The runtime emits OpenAI-ish
 * chat.completion.chunk frames for text deltas AND Compose-native frames
 * (`thinking_start`, `thinking_end`, `tool_start`, `tool_end`, `done`,
 * `error`). This resource normalises both into the single
 * `AgentRuntimeEvent` union so callers iterate one loop.
 *
 * Integrates with:
 *   - `sdk.events.toolCallStart` / `toolCallEnd` — emitted whenever the
 *     runtime tool vocabulary fires, so UI strips can react uniformly
 *     regardless of whether the source is agent, workflow, or chat.
 *   - `sdk.events.agentStreamStart` / `agentStreamEnd` — lifecycle notifications.
 *   - `instrumentBillableResponse` — budget/receipt/sessionInvalid surfaced
 *     exactly as on every other billable SDK call.
 */

import { ComposeError } from "../errors.js";
import type { HttpClient } from "../http.js";
import { parseSSEStream } from "../streaming/sse.js";
import { extractReceiptFromResponse, parseReceiptEvent } from "../streaming/receipt.js";
import { extractSessionBudgetFromResponse } from "../streaming/budget.js";
import type { ComposeEventBus } from "../events.js";
import type {
    AgentRuntimeEvent,
    AgentStreamCreateParams,
    AgentStreamFinalResult,
    ComposeReceipt,
    SessionBudgetSnapshot,
    SessionInvalidReason,
    X402PaymentSigner,
} from "../types/index.js";
import {
    buildCallHeaders,
    type ComposeCallOptions,
    ComposeStreamIterator,
    requestResponseWithPayment,
} from "./inference.js";

export interface AgentResourceContext {
    baseUrl: string;
    http: HttpClient;
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
    getX402SignerMaybe?: () => X402PaymentSigner | null;
    events: ComposeEventBus;
    userAgent: string;
}

export class AgentResource {
    constructor(private readonly ctx: AgentResourceContext) { }

    stream(
        params: AgentStreamCreateParams,
        options: ComposeCallOptions = {},
    ): ComposeStreamIterator<AgentRuntimeEvent, AgentStreamFinalResult> {
        return new ComposeStreamIterator(driveAgentStream(this.ctx, params, options));
    }

    /**
     * Abort an in-flight stream for (agentWallet, runId). Conversation/CoT/memory
     * for the thread are preserved by the LangGraph checkpoint and can be resumed
     * by issuing a new stream call with the same threadId.
     */
    async stop(params: { agentWallet: string; runId: string; threadId?: string }): Promise<{ stopped: boolean }> {
        const wallet = this.ctx.getWalletMaybe();
        const token = this.ctx.getTokenMaybe();
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "User-Agent": this.ctx.userAgent,
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (wallet.address) headers["x-session-user-address"] = wallet.address;
        if (wallet.chainId !== null) headers["x-chain-id"] = String(wallet.chainId);

        const path = `/agent/${encodeURIComponent(params.agentWallet)}/runs/${encodeURIComponent(params.runId)}/stop`;
        const response = await this.ctx.http.request<{ stopped: boolean }>({
            method: "POST",
            path,
            headers,
            body: params.threadId ? { threadId: params.threadId } : {},
        }).withResponse();
        const data = response.data;
        return { stopped: Boolean(data?.stopped) };
    }
}

async function* driveAgentStream(
    ctx: AgentResourceContext,
    params: AgentStreamCreateParams,
    options: ComposeCallOptions,
): AsyncGenerator<AgentRuntimeEvent, AgentStreamFinalResult, void> {
    const path = `/agent/${encodeURIComponent(params.agentWallet)}/stream`;
    const wallet = ctx.getWalletMaybe();
    const token = ctx.getTokenMaybe();

    const body: Record<string, unknown> = {
        message: params.message,
        threadId: params.threadId,
        userAddress: params.userAddress,
    };
    if (params.composeRunId) body.composeRunId = params.composeRunId;
    if (params.cloudPermissions) body.cloudPermissions = params.cloudPermissions;
    if (params.attachment) body.attachment = params.attachment;
    if (params.attachments) body.attachments = params.attachments;

    const timeoutController = new AbortController();
    const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

    ctx.events.emit("agentStreamStart", {
        userAddress: wallet.address,
        chainId: wallet.chainId,
        requestId: null,
        agentWallet: params.agentWallet,
        threadId: params.threadId,
        runId: params.composeRunId,
    });

    let response: Response;
    try {
        response = await requestResponseWithPayment<unknown>(ctx.http, ctx, {
            method: "POST",
            path,
            body,
            headers: {
                ...buildCallHeaders(options, wallet, token),
                composeRunId: params.composeRunId ?? options.composeRunId,
            },
            signal: mergeSignals(options.signal, timeoutController.signal),
            timeoutMs,
            expectStream: true,
        }, options);
    } catch (fetchError) {
        clearTimeout(timer);
        if (fetchError instanceof ComposeError) throw fetchError;
        throw new ComposeError({
            code: "network_error",
            message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        });
    }

    clearTimeout(timer);

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new ComposeError({
            code: "upstream_error",
            message: `Agent runtime returned ${response.status}: ${text.slice(0, 500)}`,
            status: response.status,
        });
    }

    if (!response.body) {
        throw new ComposeError({ code: "upstream_error", message: "Agent runtime stream had no body" });
    }

    const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
    const headerReceipt = extractReceiptFromResponse(response);
    const { budget, sessionInvalidReason } = extractSessionBudgetFromResponse(response);

    if (headerReceipt) {
        ctx.events.emit("receipt", {
            userAddress: wallet.address,
            chainId: wallet.chainId,
            receipt: headerReceipt,
            requestId,
            source: "response-header",
        });
    }
    if (budget) {
        ctx.events.emit("budget", {
            userAddress: wallet.address,
            chainId: wallet.chainId,
            snapshot: budget,
            requestId,
        });
    }
    if (sessionInvalidReason) {
        ctx.events.emit("sessionInvalid", {
            userAddress: wallet.address,
            chainId: wallet.chainId,
            reason: sessionInvalidReason,
            requestId,
        });
    }

    let text = "";
    let streamReceipt: ComposeReceipt | null = null;
    let emittedDone = false;
    const toolCalls: AgentStreamFinalResult["toolCalls"] = [];
    const activeTools = new Map<string, { summary?: string }>();

    try {
        const sse = parseSSEStream(response.body, { signal: options.signal })[Symbol.asyncIterator]();
        while (true) {
            const next = await readAgentStreamFrame(sse, emittedDone ? 250 : undefined);
            if (next.done) break;
            const frame = next.value;

            if (frame.data === "[DONE]") {
                if (!emittedDone) {
                    emittedDone = true;
                    yield { type: "done" };
                }
                continue;
            }

            if (frame.event === "compose.receipt") {
                try {
                    streamReceipt = parseReceiptEvent(frame.data);
                    ctx.events.emit("receipt", {
                        userAddress: wallet.address,
                        chainId: wallet.chainId,
                        receipt: streamReceipt,
                        requestId,
                        source: "stream",
                    });
                } catch { /* skip malformed */ }
                if (emittedDone) break;
                continue;
            }

            if (frame.event === "compose.error") {
                try {
                    const parsed = JSON.parse(frame.data) as { code?: string; message?: string; details?: Record<string, unknown> };
                    yield { type: "error", code: parsed.code, message: parsed.message ?? "Agent stream error", details: parsed.details };
                } catch {
                    yield { type: "error", message: frame.data };
                }
                continue;
            }

            if (!frame.data) continue;
            if (emittedDone) continue;

            let payload: Record<string, unknown> | null = null;
            try {
                payload = JSON.parse(frame.data) as Record<string, unknown>;
            } catch {
                const delta = frame.data;
                text += delta;
                yield { type: "text-delta", delta };
                continue;
            }

            // OpenAI chat.completion.chunk passthrough — runtime forwards these
            // for streamed assistant text.
            const choices = Array.isArray(payload.choices) ? payload.choices as Array<Record<string, unknown>> : null;
            if (choices && choices.length > 0) {
                const delta = (choices[0] as { delta?: Record<string, unknown> }).delta;
                const reasoningChunk = typeof (delta as { reasoning_content?: unknown })?.reasoning_content === "string"
                    ? (delta as { reasoning_content: string }).reasoning_content
                    : null;
                if (reasoningChunk) {
                    yield { type: "reasoning-delta", delta: reasoningChunk };
                }
                const streamedChunk = typeof (delta as { content?: unknown })?.content === "string"
                    ? (delta as { content: string }).content
                    : null;
                if (streamedChunk) {
                    text += streamedChunk;
                    yield { type: "text-delta", delta: streamedChunk };
                }
                continue;
            }

            const type = typeof payload.type === "string" ? payload.type : "";

            if (type === "thinking_start") {
                yield { type: "thinking-start", message: typeof payload.message === "string" ? payload.message : "Thinking..." };
                continue;
            }
            if (type === "thinking_end") {
                yield { type: "thinking-end" };
                continue;
            }
            if (type === "reasoning_delta") {
                const delta = typeof payload.delta === "string"
                    ? payload.delta
                    : typeof payload.content === "string"
                        ? payload.content
                        : "";
                if (delta) yield { type: "reasoning-delta", delta };
                continue;
            }
            if (type === "tool_args_delta") {
                const argsDelta = typeof payload.argsDelta === "string"
                    ? payload.argsDelta
                    : typeof payload.delta === "string"
                        ? payload.delta
                        : "";
                if (argsDelta) {
                    const id = typeof payload.id === "string" ? payload.id : undefined;
                    const toolName = typeof payload.toolName === "string" ? payload.toolName : undefined;
                    yield { type: "tool-args-delta", id, toolName, argsDelta };
                }
                continue;
            }
            if (type === "stopped") {
                const reason = typeof payload.reason === "string" ? payload.reason : "user_stop";
                yield { type: "stopped", reason };
                continue;
            }
            if (type === "tool_start") {
                const toolName = typeof payload.toolName === "string" ? payload.toolName : "tool";
                const summary = typeof payload.content === "string" ? payload.content : undefined;
                const content = typeof payload.content === "string" ? payload.content : undefined;
                activeTools.set(toolName, { summary });
                ctx.events.emit("toolCallStart", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "agent",
                    toolCallId: toolName,
                    toolName,
                    summary,
                });
                yield { type: "tool-start", toolName, summary, content };
                continue;
            }
            if (type === "tool_end") {
                const toolName = typeof payload.toolName === "string" ? payload.toolName : "tool";
                const summary = typeof payload.message === "string" ? payload.message : undefined;
                const failed = typeof payload.error === "string" && payload.error.length > 0;
                const error = failed ? (payload.error as string) : undefined;
                toolCalls.push({ toolName, summary, failed, error });
                activeTools.delete(toolName);
                ctx.events.emit("toolCallEnd", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "agent",
                    toolCallId: toolName,
                    toolName,
                    summary,
                    failed,
                    error,
                });
                yield { type: "tool-end", toolName, summary, failed, error };
                continue;
            }
            if (type === "error") {
                const code = typeof payload.code === "string" ? payload.code : undefined;
                const message = typeof payload.content === "string"
                    ? payload.content
                    : typeof payload.error === "string"
                        ? payload.error
                        : typeof payload.message === "string"
                            ? payload.message
                            : "Agent stream failed";
                yield { type: "error", code, message };
                continue;
            }
            if (type === "done") {
                if (!emittedDone) {
                    emittedDone = true;
                    yield { type: "done" };
                }
                continue;
            }
            if (typeof payload.content === "string") {
                text += payload.content;
                yield { type: "text-delta", delta: payload.content };
                continue;
            }
            if (typeof payload.text === "string") {
                text += payload.text;
                yield { type: "text-delta", delta: payload.text };
                continue;
            }
        }
    } finally {
        try { await response.body?.cancel(); } catch { /* best-effort */ }
        ctx.events.emit("agentStreamEnd", {
            userAddress: wallet.address,
            chainId: wallet.chainId,
            requestId,
            agentWallet: params.agentWallet,
            threadId: params.threadId,
            runId: params.composeRunId,
        });
    }

    const finalReceipt: ComposeReceipt | null = streamReceipt ?? headerReceipt;

    return {
        text,
        toolCalls,
        requestId,
        receipt: finalReceipt,
        budget,
        sessionInvalidReason,
    };
}

function mergeSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
    if (!a) return b;
    const c = new AbortController();
    const forward = () => c.abort();
    if (a.aborted || b.aborted) c.abort();
    a.addEventListener("abort", forward, { once: true });
    b.addEventListener("abort", forward, { once: true });
    return c.signal;
}

async function readAgentStreamFrame(
    iterator: AsyncIterator<{ event: string; data: string }>,
    timeoutMs?: number,
): Promise<IteratorResult<{ event: string; data: string }>> {
    const pending = iterator.next();
    if (!timeoutMs) {
        return pending;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<IteratorResult<{ event: string; data: string }>>((resolve) => {
        timer = setTimeout(() => resolve({ done: true, value: undefined }), timeoutMs);
    });
    pending.catch(() => undefined);

    const result = await Promise.race([pending, timeout]);
    if (timer) clearTimeout(timer);
    return result;
}

// Exported so tests can poke at the internal types. Not part of the public
// SDK surface beyond `AgentResource.stream(...)`.
export type { AgentStreamCreateParams, AgentStreamFinalResult, AgentRuntimeEvent, SessionBudgetSnapshot, SessionInvalidReason };

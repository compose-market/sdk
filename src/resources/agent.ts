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
import type { FetchLike } from "../http.js";
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
} from "../types/index.js";
import { ComposeStreamIterator } from "./inference.js";

export interface AgentResourceContext {
    baseUrl: string;
    fetch: FetchLike;
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
    events: ComposeEventBus;
    userAgent: string;
}

export class AgentResource {
    constructor(private readonly ctx: AgentResourceContext) { }

    stream(
        params: AgentStreamCreateParams,
        options: { signal?: AbortSignal; timeoutMs?: number } = {},
    ): ComposeStreamIterator<AgentRuntimeEvent, AgentStreamFinalResult> {
        return new ComposeStreamIterator(driveAgentStream(this.ctx, params, options));
    }
}

async function* driveAgentStream(
    ctx: AgentResourceContext,
    params: AgentStreamCreateParams,
    options: { signal?: AbortSignal; timeoutMs?: number },
): AsyncGenerator<AgentRuntimeEvent, AgentStreamFinalResult, void> {
    const url = `${ctx.baseUrl}/agent/${encodeURIComponent(params.agentWallet)}/stream`;
    const wallet = ctx.getWalletMaybe();
    const token = ctx.getTokenMaybe();

    const headers = new Headers({
        "Content-Type": "application/json",
        "User-Agent": ctx.userAgent,
    });
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (wallet.address) headers.set("x-session-user-address", wallet.address);
    if (wallet.chainId !== null) headers.set("x-chain-id", String(wallet.chainId));
    if (params.composeRunId) headers.set("x-compose-run-id", params.composeRunId);

    const body: Record<string, unknown> = {
        message: params.message,
        threadId: params.threadId,
        userAddress: params.userAddress,
    };
    if (params.composeRunId) body.composeRunId = params.composeRunId;
    if (params.cloudPermissions) body.cloudPermissions = params.cloudPermissions;
    if (params.attachment) body.attachment = params.attachment;

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
        response = await ctx.fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body),
            signal: mergeSignals(options.signal, timeoutController.signal),
        });
    } catch (fetchError) {
        clearTimeout(timer);
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
    const toolCalls: AgentStreamFinalResult["toolCalls"] = [];
    const activeTools = new Map<string, { summary?: string }>();

    try {
        for await (const frame of parseSSEStream(response.body, { signal: options.signal })) {
            if (frame.data === "[DONE]") {
                yield { type: "done" };
                break;
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
                yield { type: "done" };
                break;
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
        try { response.body?.cancel(); } catch { /* best-effort */ }
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

// Exported so tests can poke at the internal types. Not part of the public
// SDK surface beyond `AgentResource.stream(...)`.
export type { AgentStreamCreateParams, AgentStreamFinalResult, AgentRuntimeEvent, SessionBudgetSnapshot, SessionInvalidReason };

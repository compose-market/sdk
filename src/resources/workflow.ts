/**
 * Compose workflow runtime stream resource.
 *
 * Subscribes to POST /workflow/:wallet/chat on the Compose runtime and yields
 * typed `WorkflowRuntimeEvent` values. The workflow orchestrator emits its
 * own vocabulary (`start`, `step`, `agent`, `progress`, `tool_start`,
 * `tool_end`, `result`, `error`, `complete`, `done`) via named SSE events;
 * each frame carries a JSON payload with an optional `message` field.
 *
 * Same normalisation contract as `AgentResource`:
 *   - Tool lifecycle fires on `sdk.events.toolCallStart` / `toolCallEnd`.
 *   - Workflow-level start/end fires on `workflowStreamStart` / `workflowStreamEnd`.
 *   - Budget / receipt / sessionInvalid come from response headers + streamed
 *     `compose.receipt` frames.
 */

import { ComposeError } from "../errors.js";
import type { FetchLike } from "../http.js";
import { parseSSEStream } from "../streaming/sse.js";
import { extractReceiptFromResponse, parseReceiptEvent } from "../streaming/receipt.js";
import { extractSessionBudgetFromResponse } from "../streaming/budget.js";
import type { ComposeEventBus } from "../events.js";
import type {
    ComposeReceipt,
    WorkflowRuntimeEvent,
    WorkflowStreamCreateParams,
    WorkflowStreamFinalResult,
} from "../types/index.js";
import { ComposeStreamIterator } from "./inference.js";

export interface WorkflowResourceContext {
    baseUrl: string;
    fetch: FetchLike;
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
    events: ComposeEventBus;
    userAgent: string;
}

export class WorkflowResource {
    constructor(private readonly ctx: WorkflowResourceContext) { }

    stream(
        params: WorkflowStreamCreateParams,
        options: { signal?: AbortSignal; timeoutMs?: number } = {},
    ): ComposeStreamIterator<WorkflowRuntimeEvent, WorkflowStreamFinalResult> {
        return new ComposeStreamIterator(driveWorkflowStream(this.ctx, params, options));
    }

    /**
     * Fire-and-forget stop signal for an in-flight workflow execution.
     * Returns the raw Response so callers can inspect status.
     */
    async stop(workflowWallet: string, threadId: string, options: { signal?: AbortSignal } = {}): Promise<Response> {
        const url = `${this.ctx.baseUrl}/workflow/${encodeURIComponent(workflowWallet)}/stop`;
        const wallet = this.ctx.getWalletMaybe();
        const token = this.ctx.getTokenMaybe();
        const headers = new Headers({
            "Content-Type": "application/json",
            "User-Agent": this.ctx.userAgent,
        });
        if (token) headers.set("Authorization", `Bearer ${token}`);
        if (wallet.address) headers.set("x-session-user-address", wallet.address);
        if (wallet.chainId !== null) headers.set("x-chain-id", String(wallet.chainId));
        return this.ctx.fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify({ threadId }),
            signal: options.signal,
        });
    }
}

async function* driveWorkflowStream(
    ctx: WorkflowResourceContext,
    params: WorkflowStreamCreateParams,
    options: { signal?: AbortSignal; timeoutMs?: number },
): AsyncGenerator<WorkflowRuntimeEvent, WorkflowStreamFinalResult, void> {
    const url = `${ctx.baseUrl}/workflow/${encodeURIComponent(params.workflowWallet)}/chat`;
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
    if (typeof params.lastEventIndex === "number") body.lastEventIndex = params.lastEventIndex;
    if (typeof params.continuous === "boolean") body.continuous = params.continuous;
    if (params.attachment) body.attachment = params.attachment;

    const timeoutController = new AbortController();
    const timeoutMs = options.timeoutMs ?? 10 * 60 * 1000;
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);

    ctx.events.emit("workflowStreamStart", {
        userAddress: wallet.address,
        chainId: wallet.chainId,
        requestId: null,
        workflowWallet: params.workflowWallet,
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
            message: `Workflow runtime returned ${response.status}: ${text.slice(0, 500)}`,
            status: response.status,
        });
    }

    if (!response.body) {
        throw new ComposeError({ code: "upstream_error", message: "Workflow runtime stream had no body" });
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
    let structuredOutput: unknown = null;
    let streamReceipt: ComposeReceipt | null = null;
    const toolCalls: WorkflowStreamFinalResult["toolCalls"] = [];

    try {
        for await (const frame of parseSSEStream(response.body, { signal: options.signal })) {
            const data = frame.data.trim();
            if (!data || data === "[DONE]") {
                if (data === "[DONE]") yield { type: "done" };
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
                continue;
            }

            let payload: Record<string, unknown>;
            try {
                payload = JSON.parse(data) as Record<string, unknown>;
            } catch {
                continue;
            }

            const eventName = frame.event || "";

            if (eventName === "start") {
                yield { type: "start", message: asString(payload.message, "Starting workflow..."), meta: payload };
                continue;
            }
            if (eventName === "step") {
                yield {
                    type: "step",
                    stepName: typeof payload.stepName === "string" ? payload.stepName : undefined,
                    message: asString(payload.message, `Processing ${asString(payload.stepName, "workflow step")}...`),
                    meta: payload,
                };
                continue;
            }
            if (eventName === "agent") {
                yield {
                    type: "agent",
                    agentName: typeof payload.agentName === "string" ? payload.agentName : undefined,
                    message: asString(payload.message, `Processing ${asString(payload.agentName, "agent")}...`),
                    meta: payload,
                };
                continue;
            }
            if (eventName === "progress") {
                yield { type: "progress", message: asString(payload.message, "Running workflow..."), meta: payload };
                continue;
            }
            if (eventName === "tool_start") {
                const toolName = asString(payload.toolName, "tool");
                const summary = typeof payload.content === "string"
                    ? payload.content
                    : typeof payload.message === "string" ? payload.message : undefined;
                const content = typeof payload.content === "string" ? payload.content : undefined;
                ctx.events.emit("toolCallStart", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "workflow",
                    toolCallId: toolName,
                    toolName,
                    summary,
                });
                yield { type: "tool-start", toolName, summary, content };
                continue;
            }
            if (eventName === "tool_end") {
                const toolName = asString(payload.toolName, "tool");
                const summary = typeof payload.message === "string" ? payload.message : undefined;
                const failed = typeof payload.error === "string" && payload.error.length > 0;
                const error = failed ? (payload.error as string) : undefined;
                toolCalls.push({ toolName, summary, failed, error });
                ctx.events.emit("toolCallEnd", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "workflow",
                    toolCallId: toolName,
                    toolName,
                    summary,
                    failed,
                    error,
                });
                yield { type: "tool-end", toolName, summary, failed, error };
                continue;
            }
            if (eventName === "result") {
                const output = payload.output;
                structuredOutput = output;
                const coerced = typeof output === "string"
                    ? output
                    : typeof output === "object" && output !== null
                        ? JSON.stringify(output)
                        : "";
                if (coerced) text = coerced;
                yield { type: "result", output };
                continue;
            }
            if (eventName === "error") {
                const code = typeof payload.code === "string" ? payload.code : undefined;
                const message = typeof payload.error === "string"
                    ? payload.error
                    : typeof payload.message === "string"
                        ? payload.message
                        : "Workflow stream error";
                yield { type: "error", code, message };
                continue;
            }
            if (eventName === "complete") {
                yield { type: "complete", message: asString(payload.message, "Workflow complete!") };
                continue;
            }
            if (eventName === "done") {
                yield { type: "done" };
                break;
            }

            // Unknown runtime frame — ignore rather than crash.
        }
    } finally {
        try { response.body?.cancel(); } catch { /* best-effort */ }
        ctx.events.emit("workflowStreamEnd", {
            userAddress: wallet.address,
            chainId: wallet.chainId,
            requestId,
            workflowWallet: params.workflowWallet,
            threadId: params.threadId,
            runId: params.composeRunId,
        });
    }

    return {
        text,
        structuredOutput,
        toolCalls,
        requestId,
        receipt: streamReceipt ?? headerReceipt,
        budget,
        sessionInvalidReason,
    };
}

function asString(value: unknown, fallback: string): string {
    return typeof value === "string" && value.length > 0 ? value : fallback;
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

export type { WorkflowStreamCreateParams, WorkflowStreamFinalResult, WorkflowRuntimeEvent };

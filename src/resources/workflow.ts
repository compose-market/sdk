/**
 * Compose workflow runtime stream resource.
 *
 * Subscribes to POST /workflow/:wallet/chat on the Compose runtime and yields
 * typed workflow events. The workflow orchestrator emits its
 * own vocabulary (`start`, `step`, `agent`, `progress`, `tool_start`,
 * `tool_end`, `result`, `error`, `complete`, `done`) via named SSE events;
 * each frame carries a JSON payload with an optional `message` field.
 *
 * Same normalisation contract as `AgentResource`:
 *   - Tool lifecycle fires on `sdk.events.toolCallStart` / `toolCallEnd`.
 *   - Workflow-level start/end fires on `workflowStreamStart` / `workflowStreamEnd`.
 *   - Budget / receipt / sessionInvalid come from response headers + streamed
 *     `receipt` frames.
 */

import { ComposeError } from "../errors.js";
import { applySdkClientHeaders, type FetchLike, type HttpClient } from "../http.js";
import { parseSSEStream } from "../streaming/sse.js";
import { extractReceiptFromResponse, parseReceiptEvent } from "../streaming/receipt.js";
import { extractSessionBudgetFromResponse } from "../streaming/budget.js";
import { decode as decodeActivityEvent, type ActivityEvent } from "@compose-market/core/activity";
import { decode as decodeModelEvent, type ModelEvent } from "@compose-market/core/model";
import type { ComposeEventBus } from "../events.js";
import type {
    Receipt,
    WorkflowStreamCreateParams,
    WorkflowStreamFinalResult,
    X402PaymentSigner,
} from "../types/index.js";
import {
    buildCallHeaders,
    type ComposeCallOptions,
    StreamIterator,
    requestResponseWithPayment,
} from "./inference.js";

export type WorkflowEvent = ActivityEvent | ModelEvent;

export interface WorkflowResourceContext {
    baseUrl: string;
    fetch: FetchLike;
    http: HttpClient;
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
    getX402SignerMaybe?: () => X402PaymentSigner | null;
    events: ComposeEventBus;
    userAgent: string;
}

export class WorkflowResource {
    constructor(private readonly ctx: WorkflowResourceContext) { }

    stream(
        params: WorkflowStreamCreateParams,
        options: ComposeCallOptions = {},
    ): StreamIterator<WorkflowEvent, WorkflowStreamFinalResult> {
        return new StreamIterator(driveWorkflowStream(this.ctx, params, options));
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
        });
        applySdkClientHeaders(headers, this.ctx.userAgent);
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
    options: ComposeCallOptions,
): AsyncGenerator<WorkflowEvent, WorkflowStreamFinalResult, void> {
    const path = `/workflow/${encodeURIComponent(params.workflowWallet)}/chat`;
    const wallet = ctx.getWalletMaybe();
    const token = ctx.getTokenMaybe();

    const body: Record<string, unknown> = {
        message: params.message,
        threadId: params.threadId,
        userAddress: params.userAddress,
    };
    if (params.composeRunId) body.composeRunId = params.composeRunId;
    if (typeof params.lastEventIndex === "number") body.lastEventIndex = params.lastEventIndex;
    if (typeof params.continuous === "boolean") body.continuous = params.continuous;
    if (params.attachment) body.attachment = params.attachment;
    if (params.attachments) body.attachments = params.attachments;

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

    const requestSignal = mergeSignals(options.signal, timeoutController.signal);
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
            signal: requestSignal.signal,
            timeoutMs,
            expectStream: true,
        }, options);
    } catch (fetchError) {
        requestSignal.cleanup();
        clearTimeout(timer);
        if (fetchError instanceof ComposeError) throw fetchError;
        throw new ComposeError({
            code: "network_error",
            message: fetchError instanceof Error ? fetchError.message : String(fetchError),
        });
    }

    requestSignal.cleanup();
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
    let streamReceipt: Receipt | null = null;
    let emittedDone = false;
    const toolCalls: WorkflowStreamFinalResult["toolCalls"] = [];
    const decodeOptions = { runId: params.composeRunId };

    try {
        for await (const frame of parseSSEStream(response.body, { signal: options.signal })) {
            const data = frame.data.trim();
            if (!data || data === "[DONE]") {
                if (data === "[DONE]" && !emittedDone) {
                    emittedDone = true;
                }
                continue;
            }

            if (frame.event === "receipt") {
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
            if (emittedDone) continue;

            let payload: Record<string, unknown>;
            try {
                payload = JSON.parse(data) as Record<string, unknown>;
            } catch {
                continue;
            }

            const eventName = frame.event || "";

            if (payload.domain === "model") {
                const decoded = decodeModelEvent(payload, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (payload.domain === "activity") {
                const decoded = decodeActivityEvent(payload, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }

            if (eventName === "start") {
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "step") {
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "agent") {
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "progress") {
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
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
                const decoded = decodeActivityEvent({ type: "tool-start", toolName, summary, content }, decodeOptions);
                if (decoded) yield decoded;
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
                const decoded = decodeActivityEvent({ type: "tool-end", toolName, summary, failed, error }, decodeOptions);
                if (decoded) yield decoded;
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
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "error") {
                const code = typeof payload.code === "string" ? payload.code : undefined;
                const message = typeof payload.error === "string"
                    ? payload.error
                    : typeof payload.message === "string"
                        ? payload.message
                        : "Workflow stream error";
                const decoded = decodeActivityEvent({ type: "error", code, message }, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "complete") {
                const decoded = decodeActivityEvent(frame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (eventName === "done") {
                if (!emittedDone) {
                    emittedDone = true;
                    const decoded = decodeActivityEvent(frame, decodeOptions);
                    if (decoded) yield decoded;
                }
                continue;
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

function mergeSignals(a: AbortSignal | undefined, b: AbortSignal): { signal: AbortSignal; cleanup: () => void } {
    if (!a) return { signal: b, cleanup: () => { } };
    const c = new AbortController();
    const forward = () => c.abort();
    if (a.aborted || b.aborted) c.abort();
    a.addEventListener("abort", forward, { once: true });
    b.addEventListener("abort", forward, { once: true });
    return {
        signal: c.signal,
        cleanup: () => {
            a.removeEventListener("abort", forward);
            b.removeEventListener("abort", forward);
        },
    };
}

export type { WorkflowStreamCreateParams, WorkflowStreamFinalResult, ActivityEvent, ModelEvent };

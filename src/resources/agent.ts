/**
 * Compose agent runtime stream resource.
 *
 * Subscribes to POST /agent/:wallet/stream on the Compose runtime service
 * and yields ordered model/activity events. The runtime emits OpenAI-ish
 * chat.completion.chunk frames for text deltas AND Compose-native frames
 * (`thinking_start`, `thinking_end`, `tool_start`, `tool_end`, `done`,
 * `error`). This resource normalises both into the single
 * text frames for chat content and Compose-native activity frames for
 * execution lifecycle. This resource keeps those domains separate.
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
import { decode as decodeActivityEvent, type ActivityEvent } from "@compose-market/core/activity";
import { decode as decodeModelEvent, type ModelEvent } from "@compose-market/core/model";
import type { ComposeEventBus } from "../events.js";
import type {
    AgentDecisionInput,
    AgentDecisionResult,
    AgentEventDisplay,
    AgentHarnessPlanDecision,
    AgentStreamCreateParams,
    AgentStreamFinalResult,
    Receipt,
    SessionBudgetSnapshot,
    SessionInvalidReason,
    X402PaymentSigner,
} from "../types/index.js";
import {
    buildCallHeaders,
    type ComposeCallOptions,
    StreamIterator,
    requestResponseWithPayment,
} from "./inference.js";

export type RunEvent = ActivityEvent | ModelEvent;

interface AgentTraceRuntimeEvent {
    type: "trace";
    source: "capability" | "model" | "tool" | "agent" | "harness" | "route";
    stage?: string;
    action?: string;
    message?: string;
    display?: AgentEventDisplay;
    ts?: number;
    details?: Record<string, unknown>;
}

interface AgentChildRuntimeEvent {
    type: "child";
    event: "start" | "delta" | "tool-start" | "tool-end" | "done" | "error";
    rootComposeRunId?: string;
    parentRunId?: string;
    subId?: string;
    depth?: number;
    agentWallet?: string;
    userAddress?: string;
    runKey?: string;
    runKeyChain?: string[];
    delta?: string;
    toolName?: string;
    input?: unknown;
    output?: unknown;
    failed?: boolean;
    error?: string;
    usage?: Record<string, unknown>;
    toolBatches?: number;
    stopReason?: string;
    wallMs?: number;
    display?: AgentEventDisplay;
    ts?: number;
}

interface AgentConclaveRuntimeEvent {
    type: "conclave";
    action: "write" | "read" | "list" | "delete";
    key?: string;
    success: boolean;
    display?: AgentEventDisplay;
    details?: Record<string, unknown>;
}

interface AgentHarnessPlanRuntimeEvent {
    type: "harness_plan_proposed" | "harness_plan_decided";
    proposalId: string;
    version: number;
    state: string;
    decision?: AgentHarnessPlanDecision;
    rootComposeRunId?: string;
    composeRunId?: string;
    requestedBy?: string;
    proposal?: unknown;
    markdown?: string;
    ts?: number;
    updatedAt?: number;
    approver?: string;
    reason?: string;
    feedback?: string;
    display?: AgentEventDisplay;
    details?: Record<string, unknown>;
}

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
    ): StreamIterator<RunEvent, AgentStreamFinalResult> {
        return new StreamIterator(driveAgentStream(this.ctx, params, options));
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

    async decide(params: AgentDecisionInput): Promise<AgentDecisionResult> {
        const wallet = this.ctx.getWalletMaybe();
        const token = this.ctx.getTokenMaybe();
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            "User-Agent": this.ctx.userAgent,
        };
        if (token) headers.Authorization = `Bearer ${token}`;
        if (wallet.address) headers["x-session-user-address"] = wallet.address;
        if (wallet.chainId !== null) headers["x-chain-id"] = String(wallet.chainId);

        const path = `/agent/${encodeURIComponent(params.agentWallet)}/runs/${encodeURIComponent(params.runId)}/approval`;
        return await this.ctx.http.request<AgentDecisionResult>({
            method: "POST",
            path,
            headers,
            body: {
                proposalId: params.proposalId,
                version: params.version,
                decision: params.decision,
                ...(params.approver ? { approver: params.approver } : {}),
                ...(params.reason ? { reason: params.reason } : {}),
                ...(params.feedback ? { feedback: params.feedback } : {}),
            },
        });
    }
}

async function* driveAgentStream(
    ctx: AgentResourceContext,
    params: AgentStreamCreateParams,
    options: ComposeCallOptions,
): AsyncGenerator<RunEvent, AgentStreamFinalResult, void> {
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
    let streamReceipt: Receipt | null = null;
    let emittedDone = false;
    const postDoneTimeoutMs = options.paymentMode === "x402" ? 90_000 : 250;
    const toolCalls: AgentStreamFinalResult["toolCalls"] = [];
    const activeTools = new Map<string, { summary?: string }>();
    const decodeOptions = { runId: params.composeRunId };

    try {
        const sse = parseSSEStream(response.body, { signal: options.signal })[Symbol.asyncIterator]();
        while (true) {
            const next = await readAgentStreamFrame(sse, emittedDone ? postDoneTimeoutMs : undefined);
            if (next.done) break;
            const frame = next.value;

            if (frame.data === "[DONE]") {
                if (!emittedDone) {
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
                if (emittedDone) break;
                continue;
            }

            if (frame.event === "compose.error") {
                const decoded = decodeActivityEvent(frame, decodeOptions)
                    ?? decodeActivityEvent({ type: "error", message: frame.data }, decodeOptions);
                if (decoded) yield decoded;
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
                const decoded = decodeModelEvent(delta, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }

            if (payload.domain === "model") {
                const decoded = decodeModelEvent(payload, decodeOptions);
                if (decoded) {
                    if (decoded.type === "model.text.delta" && decoded.delta) text += decoded.delta;
                    if (decoded.type === "model.text.done" && decoded.text && !text) text = decoded.text;
                    yield decoded;
                }
                continue;
            }
            if (payload.domain === "activity") {
                const decoded = decodeActivityEvent(payload, decodeOptions);
                if (decoded) yield decoded;
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
                    const decoded = decodeModelEvent({ type: "reasoning-delta", delta: reasoningChunk }, decodeOptions);
                    if (decoded) yield decoded;
                }
                const streamedChunk = typeof (delta as { content?: unknown })?.content === "string"
                    ? (delta as { content: string }).content
                    : null;
                if (streamedChunk) {
                    text += streamedChunk;
                    const decoded = decodeModelEvent({ type: "text-delta", delta: streamedChunk }, decodeOptions);
                    if (decoded) yield decoded;
                }
                continue;
            }

            const type = typeof payload.type === "string" ? payload.type : "";

            const proposalFrame = proposal(payload, type);
            if (proposalFrame) {
                emitProposal(ctx.events, wallet, requestId, proposalFrame);
                const decoded = decodeActivityEvent(proposalFrame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }

            const childFrame = child(payload, type);
            if (childFrame) {
                emitChild(ctx.events, wallet, requestId, childFrame);
                const decoded = decodeActivityEvent(childFrame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            const traceFrame = trace(payload, type);
            if (traceFrame) {
                const decoded = decodeActivityEvent(traceFrame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            const conclaveFrame = conclave(payload, type);
            if (conclaveFrame) {
                const decoded = decodeActivityEvent(conclaveFrame, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }

            if (type === "thinking_start") {
                const decoded = decodeActivityEvent(payload, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (type === "thinking_end") {
                const decoded = decodeActivityEvent(payload, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (type === "reasoning_delta") {
                const delta = typeof payload.delta === "string"
                    ? payload.delta
                    : typeof payload.content === "string"
                        ? payload.content
                        : "";
                if (delta) {
                    const decoded = decodeModelEvent({ type: "reasoning-delta", delta }, decodeOptions);
                    if (decoded) yield decoded;
                }
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
                    const decoded = decodeModelEvent({ type: "tool_args_delta", id, toolName, argsDelta }, decodeOptions);
                    if (decoded) yield decoded;
                }
                continue;
            }
            if (type === "stopped") {
                const reason = typeof payload.reason === "string" ? payload.reason : "user_stop";
                const decoded = decodeActivityEvent({ type: "stopped", reason }, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (type === "tool_start") {
                const toolName = typeof payload.toolName === "string" ? payload.toolName : "tool";
                const summary = typeof payload.content === "string" ? payload.content : undefined;
                const content = typeof payload.content === "string" ? payload.content : undefined;
                const meta = view(payload.display);
                const shown = {
                    ...(meta?.name ? { displayName: meta.name } : {}),
                    ...(meta ? { display: meta, targetKind: meta.kind } : {}),
                    ...(meta?.target ? { target: meta.target } : {}),
                };
                activeTools.set(toolName, { summary });
                ctx.events.emit("toolCallStart", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "agent",
                    toolCallId: toolName,
                    toolName,
                    ...shown,
                    summary,
                });
                const decoded = decodeActivityEvent({ type: "tool-start", toolName, display: meta, summary, content, input: payload.input }, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (type === "tool_end") {
                const toolName = typeof payload.toolName === "string" ? payload.toolName : "tool";
                const summary = typeof payload.message === "string" ? payload.message : undefined;
                const failed = typeof payload.error === "string" && payload.error.length > 0;
                const error = failed ? (payload.error as string) : undefined;
                const meta = view(payload.display);
                const displayName = meta?.name ?? display(toolName, payload);
                const shown = {
                    ...(displayName ? { displayName } : {}),
                    ...(meta ? { display: meta, targetKind: meta.kind } : {}),
                    ...(meta?.target ? { target: meta.target } : {}),
                };
                toolCalls.push({ toolName, ...shown, summary, failed, error });
                activeTools.delete(toolName);
                ctx.events.emit("toolCallEnd", {
                    userAddress: wallet.address,
                    chainId: wallet.chainId,
                    requestId,
                    source: "agent",
                    toolCallId: toolName,
                    toolName,
                    ...shown,
                    summary,
                    failed,
                    error,
                });
                const decoded = decodeActivityEvent({
                    type: "tool-end",
                    toolName,
                    display: meta,
                    summary,
                    failed,
                    error,
                    output: payload.output ?? payload.message,
                }, decodeOptions);
                if (decoded) yield decoded;
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
                const decoded = decodeActivityEvent({ type: "error", code, message }, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (type === "done") {
                if (!emittedDone) {
                    emittedDone = true;
                    const decoded = decodeActivityEvent(payload, decodeOptions);
                    if (decoded) yield decoded;
                }
                continue;
            }
            if (typeof payload.content === "string") {
                text += payload.content;
                const decoded = decodeModelEvent({ type: "text-delta", delta: payload.content }, decodeOptions);
                if (decoded) yield decoded;
                continue;
            }
            if (typeof payload.text === "string") {
                text += payload.text;
                const decoded = decodeModelEvent({ type: "text-delta", delta: payload.text }, decodeOptions);
                if (decoded) yield decoded;
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

    const finalReceipt: Receipt | null = streamReceipt ?? headerReceipt;

    return {
        text,
        toolCalls,
        requestId,
        receipt: finalReceipt,
        budget,
        sessionInvalidReason,
    };
}

function obj(value: unknown): Record<string, unknown> | null {
    return value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : null;
}

function str(value: unknown): string | undefined {
    return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function num(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function strings(value: unknown): string[] | undefined {
    return Array.isArray(value) && value.every((item) => typeof item === "string")
        ? value
        : undefined;
}

function childKind(type: string): AgentChildRuntimeEvent["event"] | null {
    switch (type) {
        case "swarm_child_start":
            return "start";
        case "swarm_child_delta":
            return "delta";
        case "swarm_child_tool_start":
            return "tool-start";
        case "swarm_child_tool_end":
            return "tool-end";
        case "swarm_child_done":
            return "done";
        case "swarm_child_error":
            return "error";
        default:
            return null;
    }
}

function view(value: unknown): AgentEventDisplay | undefined {
    const record = obj(value);
    if (!record) return undefined;
    const kind = str(record.kind);
    if (!kind || !["tool", "model", "connector", "agent", "search", "harness", "conclave", "route"].includes(kind)) {
        return undefined;
    }
    const details = obj(record.details);
    return {
        kind: kind as AgentEventDisplay["kind"],
        ...(str(record.id) ? { id: str(record.id) } : {}),
        ...(str(record.name) ? { name: str(record.name) } : {}),
        ...(str(record.target) ? { target: str(record.target) } : {}),
        ...(str(record.summary) ? { summary: str(record.summary) } : {}),
        ...(details ? { details } : {}),
    };
}

function decision(value: unknown): AgentHarnessPlanRuntimeEvent["decision"] | undefined {
    return value === "approved" || value === "rejected" || value === "changes_requested"
        ? value
        : undefined;
}

function proposal(payload: Record<string, unknown>, type: string): AgentHarnessPlanRuntimeEvent | null {
    if (type !== "harness_plan_proposed" && type !== "harness_plan_decided") return null;
    const proposalId = str(payload.proposalId);
    const version = num(payload.version);
    const state = str(payload.state);
    if (!proposalId || version === undefined || !state) return null;
    const details = obj(payload.details);
    return {
        type,
        proposalId,
        version,
        state,
        ...(decision(payload.decision) ? { decision: decision(payload.decision) } : {}),
        ...(str(payload.rootComposeRunId) ? { rootComposeRunId: str(payload.rootComposeRunId) } : {}),
        ...(str(payload.composeRunId) ? { composeRunId: str(payload.composeRunId) } : {}),
        ...(str(payload.requestedBy) ? { requestedBy: str(payload.requestedBy) } : {}),
        ...("proposal" in payload ? { proposal: payload.proposal } : {}),
        ...(str(payload.markdown) ? { markdown: str(payload.markdown) } : {}),
        ...(num(payload.ts) !== undefined ? { ts: num(payload.ts) } : {}),
        ...(num(payload.updatedAt) !== undefined ? { updatedAt: num(payload.updatedAt) } : {}),
        ...(str(payload.approver) ? { approver: str(payload.approver) } : {}),
        ...(str(payload.reason) ? { reason: str(payload.reason) } : {}),
        ...(str(payload.feedback) ? { feedback: str(payload.feedback) } : {}),
        ...(view(payload.display) ? { display: view(payload.display) } : {}),
        ...(details ? { details } : {}),
    };
}

function child(payload: Record<string, unknown>, type: string): AgentChildRuntimeEvent | null {
    const event = childKind(type);
    if (!event) return null;
    const display = view(payload.display);
    return {
        type: "child",
        event,
        ...(str(payload.rootComposeRunId) ? { rootComposeRunId: str(payload.rootComposeRunId) } : {}),
        ...(str(payload.parentRunId) ? { parentRunId: str(payload.parentRunId) } : {}),
        ...(str(payload.subId) ? { subId: str(payload.subId) } : {}),
        ...(num(payload.depth) !== undefined ? { depth: num(payload.depth) } : {}),
        ...(str(payload.agentWallet) ? { agentWallet: str(payload.agentWallet) } : {}),
        ...(str(payload.userAddress) ? { userAddress: str(payload.userAddress) } : {}),
        ...(str(payload.runKey) ? { runKey: str(payload.runKey) } : {}),
        ...(strings(payload.runKeyChain) ? { runKeyChain: strings(payload.runKeyChain) } : {}),
        ...(typeof payload.delta === "string" ? { delta: payload.delta } : {}),
        ...(str(payload.toolName) ? { toolName: str(payload.toolName) } : {}),
        ...("input" in payload ? { input: payload.input } : {}),
        ...("output" in payload ? { output: payload.output } : {}),
        ...(typeof payload.failed === "boolean" ? { failed: payload.failed } : {}),
        ...(str(payload.error) ? { error: str(payload.error) } : {}),
        ...(obj(payload.usage) ? { usage: obj(payload.usage)! } : {}),
        ...(num(payload.toolBatches) !== undefined ? { toolBatches: num(payload.toolBatches) } : {}),
        ...(str(payload.stopReason) ? { stopReason: str(payload.stopReason) } : {}),
        ...(num(payload.wallMs) !== undefined ? { wallMs: num(payload.wallMs) } : {}),
        ...(display ? { display } : {}),
        ...(num(payload.ts) !== undefined ? { ts: num(payload.ts) } : {}),
    };
}

function trace(payload: Record<string, unknown>, type: string): AgentTraceRuntimeEvent | null {
    if (type !== "trace") return null;
    const source = str(payload.source);
    if (!source || !["capability", "model", "tool", "agent", "harness", "route"].includes(source)) return null;
    const details = obj(payload.details);
    return {
        type: "trace",
        source: source as AgentTraceRuntimeEvent["source"],
        ...(str(payload.stage) ? { stage: str(payload.stage) } : {}),
        ...(str(payload.action) ? { action: str(payload.action) } : {}),
        ...(str(payload.message) ? { message: str(payload.message) } : {}),
        ...(view(payload.display) ? { display: view(payload.display) } : {}),
        ...(num(payload.ts) !== undefined ? { ts: num(payload.ts) } : {}),
        ...(details ? { details } : {}),
    };
}

function conclave(payload: Record<string, unknown>, type: string): AgentConclaveRuntimeEvent | null {
    if (type !== "conclave") return null;
    const action = str(payload.action);
    if (!action || !["write", "read", "list", "delete"].includes(action)) return null;
    return {
        type: "conclave",
        action: action as AgentConclaveRuntimeEvent["action"],
        success: payload.success === true,
        ...(str(payload.key) ? { key: str(payload.key) } : {}),
        ...(view(payload.display) ? { display: view(payload.display) } : {}),
        ...(obj(payload.details) ? { details: obj(payload.details)! } : {}),
    };
}

function emitChild(
    events: ComposeEventBus,
    wallet: { address: string | null; chainId: number | null },
    requestId: string | null,
    event: AgentChildRuntimeEvent,
): void {
    if (event.event === "delta") return;
    const payload = {
        userAddress: wallet.address,
        chainId: wallet.chainId,
        requestId,
        source: "agent" as const,
        event: event.event,
        ...(event.rootComposeRunId ? { rootComposeRunId: event.rootComposeRunId } : {}),
        ...(event.parentRunId ? { parentRunId: event.parentRunId } : {}),
        ...(event.subId ? { subId: event.subId } : {}),
        ...(event.depth !== undefined ? { depth: event.depth } : {}),
        ...(event.agentWallet ? { agentWallet: event.agentWallet } : {}),
        ...(event.runKey ? { runKey: event.runKey } : {}),
        ...(event.runKeyChain ? { runKeyChain: event.runKeyChain } : {}),
        ...(event.toolName ? { toolName: event.toolName } : {}),
        ...("input" in event ? { input: event.input } : {}),
        ...("output" in event ? { output: event.output } : {}),
        ...(event.failed !== undefined ? { failed: event.failed } : {}),
        ...(event.error ? { error: event.error } : {}),
        ...(event.usage ? { usage: event.usage } : {}),
        ...(event.toolBatches !== undefined ? { toolBatches: event.toolBatches } : {}),
        ...(event.stopReason ? { stopReason: event.stopReason } : {}),
        ...(event.wallMs !== undefined ? { wallMs: event.wallMs } : {}),
        ...(event.display ? { display: event.display } : {}),
        ...(event.ts !== undefined ? { ts: event.ts } : {}),
    };
    if (event.event === "start") {
        events.emit("childAgentStart", payload);
    } else if (event.event === "tool-start") {
        events.emit("childAgentToolStart", payload);
    } else if (event.event === "tool-end") {
        events.emit("childAgentToolEnd", payload);
    } else if (event.event === "done") {
        events.emit("childAgentDone", payload);
    } else if (event.event === "error") {
        events.emit("childAgentError", payload);
    }
}

function emitProposal(
    events: ComposeEventBus,
    wallet: { address: string | null; chainId: number | null },
    requestId: string | null,
    event: AgentHarnessPlanRuntimeEvent,
): void {
    const payload = {
        ...event,
        userAddress: wallet.address,
        chainId: wallet.chainId,
        requestId,
        source: "agent" as const,
    };
    if (event.type === "harness_plan_proposed") {
        events.emit("harnessPlanProposed", payload);
    } else {
        events.emit("harnessPlanDecided", payload);
    }
}

function body(value: unknown): string | undefined {
    const record = obj(value);
    if (!record) return str(value);
    return str(record.content)
        ?? str(obj(record.kwargs)?.content)
        ?? str(obj(record.lc_kwargs)?.content);
}

function json(value: unknown): Record<string, unknown> | null {
    const text = body(value);
    if (!text) return null;
    try {
        return obj(JSON.parse(text));
    } catch {
        return null;
    }
}

function display(toolName: string, payload: Record<string, unknown>): string | undefined {
    if (toolName !== "models_call") return undefined;
    const parsed = json(payload.output) ?? json(payload.message);
    const model = obj(parsed?.model);
    return str(model?.name) ?? str(model?.id) ?? str(model?.modelId);
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
export type {
    AgentDecisionInput,
    AgentDecisionResult,
    AgentStreamCreateParams,
    AgentStreamFinalResult,
    SessionBudgetSnapshot,
    SessionInvalidReason,
};

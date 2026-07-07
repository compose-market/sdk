/**
 * Typed event bus emitted by `ComposeSDK`.
 *
 * The event bus is the canonical way for application code to react to
 * out-of-band signals from the Compose backend that arrive as a side effect
 * of HTTP calls or SSE subscriptions:
 *
 *   - `budget`         — session-budget snapshot parsed from response headers
 *                        on every billable call.
 *   - `sessionInvalid` — `x-session-invalid` header was set, the
 *                        session must be torn down.
 *   - `sessionExpired` — SSE `session-expired` frame arrived from
 *                        `/api/session/events`.
 *   - `sessionActive`  — SSE `session-active` heartbeat frame arrived.
 *   - `receipt`        — settlement receipt parsed from `X-Receipt`
 *                        (or the SSE `event: receipt` frame).
 *   - `alert`          — typed operational/client alert emitted by Compose
 *                        services, for example session-stream lease rotation.
 *
 * Listeners are registered with `.on(event, listener)`. The bus is in-memory,
 * single-process, unordered across listeners, and never blocks the caller —
 * listener exceptions are logged via the SDK logger and discarded.
 */

import type {
    AgentArtifactKind,
    ComposeAlert,
    Receipt,
    AgentEventDisplay,
    AgentHarnessPlanDecision,
    SessionActiveEvent,
    SessionBudgetSnapshot,
    SessionExpiredEvent,
    SessionInvalidReason,
} from "./types/index.js";

export interface BudgetEvent {
    userAddress: string | null;
    chainId: number | null;
    snapshot: SessionBudgetSnapshot;
    /** Request that produced this snapshot. Matches `X-Request-Id`. */
    requestId: string | null;
}

export interface SessionInvalidEvent {
    userAddress: string | null;
    chainId: number | null;
    reason: SessionInvalidReason;
    requestId: string | null;
}

export interface ReceiptEvent {
    userAddress: string | null;
    chainId: number | null;
    receipt: Receipt;
    requestId: string | null;
    /**
     * Which code path produced the receipt:
     *   - "response-header" — decoded from `X-Receipt` on a normal
     *     JSON response.
     *   - "stream"          — parsed from the `event: receipt` SSE
     *     frame on a streaming inference call.
     *   - "body"            — mirrored from the `receipt` field on
     *     the JSON body (fallback).
     */
    source: "response-header" | "stream" | "body";
}

export interface ToolCallLifecycleEvent {
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    /** Source stream kind — which resource produced this tool-call event. */
    source: "chat" | "responses" | "agent" | "workflow";
    /** Opaque id grouping start → end. Derived from the source event if present. */
    toolCallId: string;
    toolName: string;
    /** Optional presentation label. `toolName` remains the stable raw tool id. */
    displayName?: string;
    /** Structured target metadata from the runtime, when available. */
    display?: AgentEventDisplay;
    targetKind?: AgentEventDisplay["kind"];
    target?: string;
    /** Human summary of what the tool is about to do / did. */
    summary?: string;
    /** `arguments` payload when the source stream includes it. */
    arguments?: string;
    /** Only present on `toolCallEnd`. */
    failed?: boolean;
    /** Only present on `toolCallEnd`, when the tool errored. */
    error?: string;
}

export interface AgentStreamLifecycleEvent {
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    agentWallet: string;
    threadId: string;
    runId?: string;
}

export interface ChildAgentLifecycleEvent {
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    source: "agent";
    event: "start" | "tool-start" | "tool-end" | "done" | "error";
    rootComposeRunId?: string;
    parentRunId?: string;
    subId?: string;
    depth?: number;
    agentWallet?: string;
    runKey?: string;
    runKeyChain?: string[];
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

export interface AgentHarnessPlanEvent {
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
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    source: "agent";
}

export interface AgentArtifactEvent {
    type: "artifact";
    artifactType: AgentArtifactKind;
    url?: string;
    inline?: boolean;
    mimeType?: string;
    bytes?: number;
    responseId?: string;
    status?: string;
    jobId?: string;
    sourceTool?: string;
    runKey?: string;
    parentRunId?: string;
    raw?: Record<string, unknown>;
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    source: "agent" | "child";
}

export interface WorkflowStreamLifecycleEvent {
    userAddress: string | null;
    chainId: number | null;
    requestId: string | null;
    workflowWallet: string;
    threadId: string;
    runId?: string;
}

export interface ComposeEventMap {
    budget: BudgetEvent;
    sessionInvalid: SessionInvalidEvent;
    sessionActive: SessionActiveEvent;
    sessionExpired: SessionExpiredEvent;
    receipt: ReceiptEvent;
    alert: ComposeAlert;
    toolCallStart: ToolCallLifecycleEvent;
    toolCallEnd: ToolCallLifecycleEvent;
    childAgentStart: ChildAgentLifecycleEvent;
    childAgentToolStart: ChildAgentLifecycleEvent;
    childAgentToolEnd: ChildAgentLifecycleEvent;
    childAgentDone: ChildAgentLifecycleEvent;
    childAgentError: ChildAgentLifecycleEvent;
    harnessPlanProposed: AgentHarnessPlanEvent;
    harnessPlanDecided: AgentHarnessPlanEvent;
    agentArtifact: AgentArtifactEvent;
    agentStreamStart: AgentStreamLifecycleEvent;
    agentStreamEnd: AgentStreamLifecycleEvent;
    workflowStreamStart: WorkflowStreamLifecycleEvent;
    workflowStreamEnd: WorkflowStreamLifecycleEvent;
}

export type ComposeEventName = keyof ComposeEventMap;

export type ComposeEventListener<E extends ComposeEventName> = (
    event: ComposeEventMap[E],
) => void | Promise<void>;

export interface ComposeEventBus {
    on<E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): () => void;
    once<E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): () => void;
    off<E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): void;
    emit<E extends ComposeEventName>(event: E, payload: ComposeEventMap[E]): void;
}

interface InternalBusOptions {
    logger?: {
        warn?: (msg: string, meta?: Record<string, unknown>) => void;
        error?: (msg: string, meta?: Record<string, unknown>) => void;
    };
}

export function createEventBus(options: InternalBusOptions = {}): ComposeEventBus {
    const listeners = new Map<ComposeEventName, Set<ComposeEventListener<ComposeEventName>>>();
    const logger = options.logger;

    const register = <E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): (() => void) => {
        const existing = listeners.get(event) ?? new Set();
        existing.add(listener as ComposeEventListener<ComposeEventName>);
        listeners.set(event, existing);
        return () => off(event, listener);
    };

    const off = <E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): void => {
        const set = listeners.get(event);
        if (!set) return;
        set.delete(listener as ComposeEventListener<ComposeEventName>);
        if (set.size === 0) listeners.delete(event);
    };

    const emit = <E extends ComposeEventName>(event: E, payload: ComposeEventMap[E]): void => {
        const set = listeners.get(event);
        if (!set || set.size === 0) return;
        // Iterate a snapshot so listeners that unsubscribe inside their own
        // handler do not mutate the iteration order.
        for (const listener of Array.from(set)) {
            try {
                const result = (listener as ComposeEventListener<E>)(payload);
                if (result && typeof (result as Promise<void>).catch === "function") {
                    (result as Promise<void>).catch((err) => {
                        logger?.error?.(`[events] async listener for ${event} threw`, { err });
                    });
                }
            } catch (err) {
                logger?.error?.(`[events] listener for ${event} threw`, { err });
            }
        }
    };

    const once = <E extends ComposeEventName>(event: E, listener: ComposeEventListener<E>): (() => void) => {
        const wrapped: ComposeEventListener<E> = (payload) => {
            off(event, wrapped);
            return listener(payload);
        };
        return register(event, wrapped);
    };

    return { on: register, once, off, emit };
}

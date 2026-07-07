import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryBudget, AgentMemoryBudget$Outbound } from "./agent-memory-budget.js";
import { AgentMemoryLayer } from "./agent-memory-layer.js";
import { AgentMemoryToolEvent, AgentMemoryToolEvent$Outbound } from "./agent-memory-tool-event.js";
import { AgentMemoryTurnMessage, AgentMemoryTurnMessage$Outbound } from "./agent-memory-turn-message.js";
export declare const AgentMemoryLoopRequestScope3: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryLoopRequestScope3 = ClosedEnum<typeof AgentMemoryLoopRequestScope3>;
export type AgentMemoryLoopRequestRemember = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryLoopRequestScope3 | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    content: string;
    type?: string | undefined;
    retention?: string | undefined;
    conflictPolicy?: string | undefined;
    confidence?: number | undefined;
    enableGraph?: boolean | undefined;
    step: "remember";
};
export declare const AgentMemoryLoopRequestScope2: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryLoopRequestScope2 = ClosedEnum<typeof AgentMemoryLoopRequestScope2>;
export type AgentMemoryLoopRequestPostTurn = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryLoopRequestScope2 | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    contextId?: string | undefined;
    turnId?: string | undefined;
    sessionId?: string | undefined;
    messages?: Array<AgentMemoryTurnMessage> | undefined;
    toolEvents?: Array<AgentMemoryToolEvent> | undefined;
    userMessage?: string | undefined;
    assistantMessage?: string | undefined;
    modelUsed?: string | undefined;
    model?: string | undefined;
    totalTokens?: number | undefined;
    tokenCount?: number | undefined;
    contextWindow?: number | undefined;
    summary?: string | undefined;
    step: "post_turn";
};
export declare const AgentMemoryLoopRequestScope1: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryLoopRequestScope1 = ClosedEnum<typeof AgentMemoryLoopRequestScope1>;
export type AgentMemoryLoopRequestPreTurn = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryLoopRequestScope1 | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    query: string;
    layers?: Array<AgentMemoryLayer> | undefined;
    limit?: number | undefined;
    maxItems?: number | undefined;
    maxItemChars?: number | undefined;
    budget?: AgentMemoryBudget | undefined;
    includeRaw?: boolean | undefined;
    step: "pre_turn";
};
export type AgentMemoryLoopRequest = AgentMemoryLoopRequestPreTurn | AgentMemoryLoopRequestPostTurn | AgentMemoryLoopRequestRemember;
/** @internal */
export declare const AgentMemoryLoopRequestScope3$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryLoopRequestScope3>;
/** @internal */
export type AgentMemoryLoopRequestRemember$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    content: string;
    type?: string | undefined;
    retention?: string | undefined;
    conflictPolicy?: string | undefined;
    confidence?: number | undefined;
    enableGraph?: boolean | undefined;
    step: "remember";
};
/** @internal */
export declare const AgentMemoryLoopRequestRemember$outboundSchema: z.ZodMiniType<AgentMemoryLoopRequestRemember$Outbound, AgentMemoryLoopRequestRemember>;
export declare function agentMemoryLoopRequestRememberToJSON(agentMemoryLoopRequestRemember: AgentMemoryLoopRequestRemember): string;
/** @internal */
export declare const AgentMemoryLoopRequestScope2$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryLoopRequestScope2>;
/** @internal */
export type AgentMemoryLoopRequestPostTurn$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    contextId?: string | undefined;
    turnId?: string | undefined;
    sessionId?: string | undefined;
    messages?: Array<AgentMemoryTurnMessage$Outbound> | undefined;
    toolEvents?: Array<AgentMemoryToolEvent$Outbound> | undefined;
    userMessage?: string | undefined;
    assistantMessage?: string | undefined;
    modelUsed?: string | undefined;
    model?: string | undefined;
    totalTokens?: number | undefined;
    tokenCount?: number | undefined;
    contextWindow?: number | undefined;
    summary?: string | undefined;
    step: "post_turn";
};
/** @internal */
export declare const AgentMemoryLoopRequestPostTurn$outboundSchema: z.ZodMiniType<AgentMemoryLoopRequestPostTurn$Outbound, AgentMemoryLoopRequestPostTurn>;
export declare function agentMemoryLoopRequestPostTurnToJSON(agentMemoryLoopRequestPostTurn: AgentMemoryLoopRequestPostTurn): string;
/** @internal */
export declare const AgentMemoryLoopRequestScope1$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryLoopRequestScope1>;
/** @internal */
export type AgentMemoryLoopRequestPreTurn$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    query: string;
    layers?: Array<string> | undefined;
    limit?: number | undefined;
    maxItems?: number | undefined;
    maxItemChars?: number | undefined;
    budget?: AgentMemoryBudget$Outbound | undefined;
    includeRaw?: boolean | undefined;
    step: "pre_turn";
};
/** @internal */
export declare const AgentMemoryLoopRequestPreTurn$outboundSchema: z.ZodMiniType<AgentMemoryLoopRequestPreTurn$Outbound, AgentMemoryLoopRequestPreTurn>;
export declare function agentMemoryLoopRequestPreTurnToJSON(agentMemoryLoopRequestPreTurn: AgentMemoryLoopRequestPreTurn): string;
/** @internal */
export type AgentMemoryLoopRequest$Outbound = AgentMemoryLoopRequestPreTurn$Outbound | AgentMemoryLoopRequestPostTurn$Outbound | AgentMemoryLoopRequestRemember$Outbound;
/** @internal */
export declare const AgentMemoryLoopRequest$outboundSchema: z.ZodMiniType<AgentMemoryLoopRequest$Outbound, AgentMemoryLoopRequest>;
export declare function agentMemoryLoopRequestToJSON(agentMemoryLoopRequest: AgentMemoryLoopRequest): string;
//# sourceMappingURL=agent-memory-loop-request.d.ts.map
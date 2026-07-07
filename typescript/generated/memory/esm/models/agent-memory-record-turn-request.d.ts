import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryToolEvent, AgentMemoryToolEvent$Outbound } from "./agent-memory-tool-event.js";
import { AgentMemoryTurnMessage, AgentMemoryTurnMessage$Outbound } from "./agent-memory-turn-message.js";
export declare const AgentMemoryRecordTurnRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryRecordTurnRequestScope = ClosedEnum<typeof AgentMemoryRecordTurnRequestScope>;
export type AgentMemoryRecordTurnRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryRecordTurnRequestScope | undefined;
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
};
/** @internal */
export declare const AgentMemoryRecordTurnRequestScope$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryRecordTurnRequestScope>;
/** @internal */
export type AgentMemoryRecordTurnRequest$Outbound = {
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
};
/** @internal */
export declare const AgentMemoryRecordTurnRequest$outboundSchema: z.ZodMiniType<AgentMemoryRecordTurnRequest$Outbound, AgentMemoryRecordTurnRequest>;
export declare function agentMemoryRecordTurnRequestToJSON(agentMemoryRecordTurnRequest: AgentMemoryRecordTurnRequest): string;
//# sourceMappingURL=agent-memory-record-turn-request.d.ts.map
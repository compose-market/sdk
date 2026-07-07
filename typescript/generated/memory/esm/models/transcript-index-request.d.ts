import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryTurnMessage, AgentMemoryTurnMessage$Outbound } from "./agent-memory-turn-message.js";
export declare const TranscriptIndexRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type TranscriptIndexRequestScope = ClosedEnum<typeof TranscriptIndexRequestScope>;
export type TranscriptIndexRequest = {
    sessionId: string;
    threadId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    scope?: TranscriptIndexRequestScope | undefined;
    haiId?: string | undefined;
    messages: Array<AgentMemoryTurnMessage>;
    modelUsed?: string | undefined;
    model?: string | undefined;
    totalTokens?: number | undefined;
    tokenCount?: number | undefined;
    rememberWorkingMemory?: boolean | undefined;
};
/** @internal */
export declare const TranscriptIndexRequestScope$outboundSchema: z.ZodMiniEnum<typeof TranscriptIndexRequestScope>;
/** @internal */
export type TranscriptIndexRequest$Outbound = {
    sessionId: string;
    threadId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    messages: Array<AgentMemoryTurnMessage$Outbound>;
    modelUsed?: string | undefined;
    model?: string | undefined;
    totalTokens?: number | undefined;
    tokenCount?: number | undefined;
    rememberWorkingMemory?: boolean | undefined;
};
/** @internal */
export declare const TranscriptIndexRequest$outboundSchema: z.ZodMiniType<TranscriptIndexRequest$Outbound, TranscriptIndexRequest>;
export declare function transcriptIndexRequestToJSON(transcriptIndexRequest: TranscriptIndexRequest): string;
//# sourceMappingURL=transcript-index-request.d.ts.map
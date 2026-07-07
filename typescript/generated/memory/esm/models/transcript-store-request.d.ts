import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryTurnMessage, AgentMemoryTurnMessage$Outbound } from "./agent-memory-turn-message.js";
export declare const TranscriptStoreRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type TranscriptStoreRequestScope = ClosedEnum<typeof TranscriptStoreRequestScope>;
export type TranscriptStoreRequest = {
    sessionId: string;
    threadId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    scope?: TranscriptStoreRequestScope | undefined;
    haiId?: string | undefined;
    messages: Array<AgentMemoryTurnMessage>;
    tokenCount: number;
    summary?: string | undefined;
    summaryEmbedding?: Array<number> | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const TranscriptStoreRequestScope$outboundSchema: z.ZodMiniEnum<typeof TranscriptStoreRequestScope>;
/** @internal */
export type TranscriptStoreRequest$Outbound = {
    sessionId: string;
    threadId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    messages: Array<AgentMemoryTurnMessage$Outbound>;
    tokenCount: number;
    summary?: string | undefined;
    summaryEmbedding?: Array<number> | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const TranscriptStoreRequest$outboundSchema: z.ZodMiniType<TranscriptStoreRequest$Outbound, TranscriptStoreRequest>;
export declare function transcriptStoreRequestToJSON(transcriptStoreRequest: TranscriptStoreRequest): string;
//# sourceMappingURL=transcript-store-request.d.ts.map
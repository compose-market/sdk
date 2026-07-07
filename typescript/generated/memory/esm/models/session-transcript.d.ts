import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { AgentMemoryTurnMessage } from "./agent-memory-turn-message.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const SessionTranscriptScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type SessionTranscriptScope = OpenEnum<typeof SessionTranscriptScope>;
export type SessionTranscript = {
    sessionId: string;
    threadId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    scope?: SessionTranscriptScope | undefined;
    haiId?: string | undefined;
    messages: Array<AgentMemoryTurnMessage>;
    summary?: string | undefined;
    tokenCount?: number | undefined;
    metadata: {
        [k: string]: any;
    };
    createdAt: number;
    expiresAt?: number | undefined;
};
/** @internal */
export declare const SessionTranscriptScope$inboundSchema: z.ZodMiniType<SessionTranscriptScope, unknown>;
/** @internal */
export declare const SessionTranscript$inboundSchema: z.ZodMiniType<SessionTranscript, unknown>;
export declare function sessionTranscriptFromJSON(jsonString: string): SafeParseResult<SessionTranscript, SDKValidationError>;
//# sourceMappingURL=session-transcript.d.ts.map
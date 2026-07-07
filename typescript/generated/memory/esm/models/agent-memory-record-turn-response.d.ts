import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { AgentMemoryLoopEnvelope } from "./agent-memory-loop-envelope.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type Stored = {
    transcript: boolean;
    working: boolean;
    vector: boolean;
    graph: boolean;
};
export type AgentMemoryRecordTurnResponse = {
    loop: AgentMemoryLoopEnvelope;
    success: true;
    sessionId: string;
    threadId: string;
    turnId: string;
    vectorId?: string | undefined;
    stored: Stored;
};
/** @internal */
export declare const Stored$inboundSchema: z.ZodMiniType<Stored, unknown>;
export declare function storedFromJSON(jsonString: string): SafeParseResult<Stored, SDKValidationError>;
/** @internal */
export declare const AgentMemoryRecordTurnResponse$inboundSchema: z.ZodMiniType<AgentMemoryRecordTurnResponse, unknown>;
export declare function agentMemoryRecordTurnResponseFromJSON(jsonString: string): SafeParseResult<AgentMemoryRecordTurnResponse, SDKValidationError>;
//# sourceMappingURL=agent-memory-record-turn-response.d.ts.map
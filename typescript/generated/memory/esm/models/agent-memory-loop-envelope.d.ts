import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { AgentMemoryLoopStep } from "./agent-memory-loop-step.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type AgentMemoryLoopEnvelope = {
    v: "compose.agent_memory_loop.v1";
    step: AgentMemoryLoopStep;
    next: Array<AgentMemoryLoopStep>;
};
/** @internal */
export declare const AgentMemoryLoopEnvelope$inboundSchema: z.ZodMiniType<AgentMemoryLoopEnvelope, unknown>;
export declare function agentMemoryLoopEnvelopeFromJSON(jsonString: string): SafeParseResult<AgentMemoryLoopEnvelope, SDKValidationError>;
//# sourceMappingURL=agent-memory-loop-envelope.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { AgentMemoryLoopEnvelope } from "./agent-memory-loop-envelope.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryRememberedItem } from "./memory-remembered-item.js";
export type AgentMemoryRememberResponse = {
    loop: AgentMemoryLoopEnvelope;
    success: boolean;
    graphSaved: boolean;
    vectorSaved: boolean;
    vectorId?: string | undefined;
    memory?: MemoryRememberedItem | undefined;
};
/** @internal */
export declare const AgentMemoryRememberResponse$inboundSchema: z.ZodMiniType<AgentMemoryRememberResponse, unknown>;
export declare function agentMemoryRememberResponseFromJSON(jsonString: string): SafeParseResult<AgentMemoryRememberResponse, SDKValidationError>;
//# sourceMappingURL=agent-memory-remember-response.d.ts.map
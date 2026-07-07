import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type AgentMemoryCompactItem = {
    layer: string;
    text: string;
    id?: string | undefined;
    score?: number | undefined;
    source?: string | undefined;
    createdAt?: number | undefined;
};
/** @internal */
export declare const AgentMemoryCompactItem$inboundSchema: z.ZodMiniType<AgentMemoryCompactItem, unknown>;
export declare function agentMemoryCompactItemFromJSON(jsonString: string): SafeParseResult<AgentMemoryCompactItem, SDKValidationError>;
//# sourceMappingURL=agent-memory-compact-item.d.ts.map
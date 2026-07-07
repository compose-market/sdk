import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type AgentMemoryContextUsage = {
    characters: number;
    rawCharacters: number;
    budgetCharacters?: number | undefined;
    savedCharactersVsRaw: number;
    items: number;
};
/** @internal */
export declare const AgentMemoryContextUsage$inboundSchema: z.ZodMiniType<AgentMemoryContextUsage, unknown>;
export declare function agentMemoryContextUsageFromJSON(jsonString: string): SafeParseResult<AgentMemoryContextUsage, SDKValidationError>;
//# sourceMappingURL=agent-memory-context-usage.d.ts.map
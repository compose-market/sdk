import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryPatternPromoteResponse = {
    skillId: string;
    promoted: boolean;
};
/** @internal */
export declare const MemoryPatternPromoteResponse$inboundSchema: z.ZodMiniType<MemoryPatternPromoteResponse, unknown>;
export declare function memoryPatternPromoteResponseFromJSON(jsonString: string): SafeParseResult<MemoryPatternPromoteResponse, SDKValidationError>;
//# sourceMappingURL=memory-pattern-promote-response.d.ts.map
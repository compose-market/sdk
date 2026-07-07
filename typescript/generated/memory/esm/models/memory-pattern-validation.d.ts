import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryPatternValidation = {
    valid: boolean;
    confidence: number;
    occurrences: number;
    successRate: number;
    toolSequence: Array<string>;
};
/** @internal */
export declare const MemoryPatternValidation$inboundSchema: z.ZodMiniType<MemoryPatternValidation, unknown>;
/** @internal */
export type MemoryPatternValidation$Outbound = {
    valid: boolean;
    confidence: number;
    occurrences: number;
    successRate: number;
    toolSequence: Array<string>;
};
/** @internal */
export declare const MemoryPatternValidation$outboundSchema: z.ZodMiniType<MemoryPatternValidation$Outbound, MemoryPatternValidation>;
export declare function memoryPatternValidationToJSON(memoryPatternValidation: MemoryPatternValidation): string;
export declare function memoryPatternValidationFromJSON(jsonString: string): SafeParseResult<MemoryPatternValidation, SDKValidationError>;
//# sourceMappingURL=memory-pattern-validation.d.ts.map
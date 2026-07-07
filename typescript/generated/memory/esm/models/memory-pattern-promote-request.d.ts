import * as z from "zod/v4-mini";
import { MemoryPatternValidation, MemoryPatternValidation$Outbound } from "./memory-pattern-validation.js";
export type MemoryPatternPromoteRequest = {
    skillName: string;
    validationData: MemoryPatternValidation;
};
/** @internal */
export type MemoryPatternPromoteRequest$Outbound = {
    skillName: string;
    validationData: MemoryPatternValidation$Outbound;
};
/** @internal */
export declare const MemoryPatternPromoteRequest$outboundSchema: z.ZodMiniType<MemoryPatternPromoteRequest$Outbound, MemoryPatternPromoteRequest>;
export declare function memoryPatternPromoteRequestToJSON(memoryPatternPromoteRequest: MemoryPatternPromoteRequest): string;
//# sourceMappingURL=memory-pattern-promote-request.d.ts.map
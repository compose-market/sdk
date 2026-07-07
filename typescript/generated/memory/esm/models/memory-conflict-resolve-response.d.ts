import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryConflictResolveResponse = {
    resolved: boolean;
    memoryId: string;
};
/** @internal */
export declare const MemoryConflictResolveResponse$inboundSchema: z.ZodMiniType<MemoryConflictResolveResponse, unknown>;
export declare function memoryConflictResolveResponseFromJSON(jsonString: string): SafeParseResult<MemoryConflictResolveResponse, SDKValidationError>;
//# sourceMappingURL=memory-conflict-resolve-response.d.ts.map
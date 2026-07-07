import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryLoopManifest } from "./memory-loop-manifest.js";
export type MemoryLoopResponse = {
    loop: MemoryLoopManifest;
};
/** @internal */
export declare const MemoryLoopResponse$inboundSchema: z.ZodMiniType<MemoryLoopResponse, unknown>;
export declare function memoryLoopResponseFromJSON(jsonString: string): SafeParseResult<MemoryLoopResponse, SDKValidationError>;
//# sourceMappingURL=memory-loop-response.d.ts.map
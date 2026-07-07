import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryLoopManifest } from "./memory-loop-manifest.js";
export type MemoryLoopListResponse = {
    loops: Array<MemoryLoopManifest>;
};
/** @internal */
export declare const MemoryLoopListResponse$inboundSchema: z.ZodMiniType<MemoryLoopListResponse, unknown>;
export declare function memoryLoopListResponseFromJSON(jsonString: string): SafeParseResult<MemoryLoopListResponse, SDKValidationError>;
//# sourceMappingURL=memory-loop-list-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemorySchedulePauseResponse = {
    paused: boolean;
};
/** @internal */
export declare const MemorySchedulePauseResponse$inboundSchema: z.ZodMiniType<MemorySchedulePauseResponse, unknown>;
export declare function memorySchedulePauseResponseFromJSON(jsonString: string): SafeParseResult<MemorySchedulePauseResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-pause-response.d.ts.map
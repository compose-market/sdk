import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryScheduleResumeResponse = {
    resumed: boolean;
};
/** @internal */
export declare const MemoryScheduleResumeResponse$inboundSchema: z.ZodMiniType<MemoryScheduleResumeResponse, unknown>;
export declare function memoryScheduleResumeResponseFromJSON(jsonString: string): SafeParseResult<MemoryScheduleResumeResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-resume-response.d.ts.map
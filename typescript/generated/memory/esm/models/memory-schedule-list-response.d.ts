import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryScheduleStatus } from "./memory-schedule-status.js";
export type MemoryScheduleListResponse = {
    schedules: Array<MemoryScheduleStatus>;
};
/** @internal */
export declare const MemoryScheduleListResponse$inboundSchema: z.ZodMiniType<MemoryScheduleListResponse, unknown>;
export declare function memoryScheduleListResponseFromJSON(jsonString: string): SafeParseResult<MemoryScheduleListResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-list-response.d.ts.map
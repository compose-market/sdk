import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryScheduleStatus = {
    scheduleId: string;
    paused: boolean;
    lastRunAt?: number | undefined;
    nextRunAt?: number | undefined;
    note?: string | undefined;
};
/** @internal */
export declare const MemoryScheduleStatus$inboundSchema: z.ZodMiniType<MemoryScheduleStatus, unknown>;
export declare function memoryScheduleStatusFromJSON(jsonString: string): SafeParseResult<MemoryScheduleStatus, SDKValidationError>;
//# sourceMappingURL=memory-schedule-status.d.ts.map
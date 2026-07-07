import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryScheduleDeleteResponse = {
    deleted: boolean;
};
/** @internal */
export declare const MemoryScheduleDeleteResponse$inboundSchema: z.ZodMiniType<MemoryScheduleDeleteResponse, unknown>;
export declare function memoryScheduleDeleteResponseFromJSON(jsonString: string): SafeParseResult<MemoryScheduleDeleteResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-delete-response.d.ts.map
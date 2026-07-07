import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryScheduleCreateResponse = {
    created: boolean;
};
/** @internal */
export declare const MemoryScheduleCreateResponse$inboundSchema: z.ZodMiniType<MemoryScheduleCreateResponse, unknown>;
export declare function memoryScheduleCreateResponseFromJSON(jsonString: string): SafeParseResult<MemoryScheduleCreateResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-create-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryScheduleTriggerResponse = {
    triggered: boolean;
};
/** @internal */
export declare const MemoryScheduleTriggerResponse$inboundSchema: z.ZodMiniType<MemoryScheduleTriggerResponse, unknown>;
export declare function memoryScheduleTriggerResponseFromJSON(jsonString: string): SafeParseResult<MemoryScheduleTriggerResponse, SDKValidationError>;
//# sourceMappingURL=memory-schedule-trigger-response.d.ts.map
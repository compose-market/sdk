import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type SuccessResponse = {
    success: boolean;
};
/** @internal */
export declare const SuccessResponse$inboundSchema: z.ZodMiniType<SuccessResponse, unknown>;
export declare function successResponseFromJSON(jsonString: string): SafeParseResult<SuccessResponse, SDKValidationError>;
//# sourceMappingURL=success-response.d.ts.map
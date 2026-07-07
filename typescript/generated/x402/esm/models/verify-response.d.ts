import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type VerifyResponse = {
    isValid: boolean;
    invalidReason?: string | undefined;
    invalidMessage?: string | undefined;
    payer?: string | undefined;
};
/** @internal */
export declare const VerifyResponse$inboundSchema: z.ZodMiniType<VerifyResponse, unknown>;
export declare function verifyResponseFromJSON(jsonString: string): SafeParseResult<VerifyResponse, SDKValidationError>;
//# sourceMappingURL=verify-response.d.ts.map
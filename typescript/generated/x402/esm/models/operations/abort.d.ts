import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
export type AbortRequest = {
    paymentIntentId: string;
    reason?: string | undefined;
};
/**
 * Payment intent abort result.
 */
export type AbortResponse = {
    success: boolean;
    paymentIntentId: string;
};
/** @internal */
export type AbortRequest$Outbound = {
    paymentIntentId: string;
    reason?: string | undefined;
};
/** @internal */
export declare const AbortRequest$outboundSchema: z.ZodMiniType<AbortRequest$Outbound, AbortRequest>;
export declare function abortRequestToJSON(abortRequest: AbortRequest): string;
/** @internal */
export declare const AbortResponse$inboundSchema: z.ZodMiniType<AbortResponse, unknown>;
export declare function abortResponseFromJSON(jsonString: string): SafeParseResult<AbortResponse, SDKValidationError>;
//# sourceMappingURL=abort.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type PaymentRequiredResource = {
    url: string;
    description?: string | undefined;
    mimeType?: string | undefined;
};
/** @internal */
export declare const PaymentRequiredResource$inboundSchema: z.ZodMiniType<PaymentRequiredResource, unknown>;
export declare function paymentRequiredResourceFromJSON(jsonString: string): SafeParseResult<PaymentRequiredResource, SDKValidationError>;
//# sourceMappingURL=payment-required-error.d.ts.map
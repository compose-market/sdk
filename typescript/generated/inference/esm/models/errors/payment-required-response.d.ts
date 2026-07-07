import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { ErrorEnvelope } from "./error-envelope.js";
import { PaymentRequiredError } from "./payment-required-error.js";
import { SDKValidationError } from "./sdk-validation-error.js";
/**
 * x402 payment challenge.
 */
export type PaymentRequiredResponse = PaymentRequiredError | ErrorEnvelope;
/** @internal */
export declare const PaymentRequiredResponse$inboundSchema: z.ZodMiniType<PaymentRequiredResponse, unknown>;
export declare function paymentRequiredResponseFromJSON(jsonString: string): SafeParseResult<PaymentRequiredResponse, SDKValidationError>;
//# sourceMappingURL=payment-required-response.d.ts.map
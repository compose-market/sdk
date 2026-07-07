import * as z from "zod/v4-mini";
import { PaymentPayload, PaymentPayload$Outbound } from "./payment-payload.js";
import { PaymentRequirements, PaymentRequirements$Outbound } from "./payment-requirements.js";
export type FacilitatorPaymentRequest = {
    x402Version: 2;
    paymentPayload: PaymentPayload;
    paymentRequirements: PaymentRequirements;
};
/** @internal */
export type FacilitatorPaymentRequest$Outbound = {
    x402Version: 2;
    paymentPayload: PaymentPayload$Outbound;
    paymentRequirements: PaymentRequirements$Outbound;
};
/** @internal */
export declare const FacilitatorPaymentRequest$outboundSchema: z.ZodMiniType<FacilitatorPaymentRequest$Outbound, FacilitatorPaymentRequest>;
export declare function facilitatorPaymentRequestToJSON(facilitatorPaymentRequest: FacilitatorPaymentRequest): string;
//# sourceMappingURL=facilitator-payment-request.d.ts.map
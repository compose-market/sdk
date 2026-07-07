import * as z from "zod/v4-mini";
import { PaymentRequirements, PaymentRequirements$Outbound } from "./payment-requirements.js";
import { ResourceProperties, ResourceProperties$Outbound } from "./resource-properties.js";
export type PaymentPayload = {
    x402Version: 2;
    accepted: PaymentRequirements;
    /**
     * Scheme-specific signed authorization payload.
     */
    payload: any;
    resource?: ResourceProperties | undefined;
    extensions?: {
        [k: string]: any;
    } | null | undefined;
};
/** @internal */
export type PaymentPayload$Outbound = {
    x402Version: 2;
    accepted: PaymentRequirements$Outbound;
    payload: any;
    resource?: ResourceProperties$Outbound | undefined;
    extensions?: {
        [k: string]: any;
    } | null | undefined;
};
/** @internal */
export declare const PaymentPayload$outboundSchema: z.ZodMiniType<PaymentPayload$Outbound, PaymentPayload>;
export declare function paymentPayloadToJSON(paymentPayload: PaymentPayload): string;
//# sourceMappingURL=payment-payload.d.ts.map
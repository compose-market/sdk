import * as z from "zod/v4-mini";
import { MeteredInput, MeteredInput$Outbound } from "./metered-input.js";
export type PaymentPrepareRequest = {
    service: string;
    action: string;
    resource: string;
    method: string;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    maxAmountWei?: string | undefined;
    meter?: MeteredInput | undefined;
    runId?: string | undefined;
    idempotencyKey?: string | undefined;
};
/** @internal */
export type PaymentPrepareRequest$Outbound = {
    service: string;
    action: string;
    resource: string;
    method: string;
    maxAmountWei?: string | undefined;
    meter?: MeteredInput$Outbound | undefined;
    runId?: string | undefined;
    idempotencyKey?: string | undefined;
};
/** @internal */
export declare const PaymentPrepareRequest$outboundSchema: z.ZodMiniType<PaymentPrepareRequest$Outbound, PaymentPrepareRequest>;
export declare function paymentPrepareRequestToJSON(paymentPrepareRequest: PaymentPrepareRequest): string;
//# sourceMappingURL=payment-prepare-request.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type SettleRequest = {
    paymentIntentId: string;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    finalAmountWei?: string | undefined;
    meter?: models.MeteredInput | undefined;
};
/** @internal */
export type SettleRequest$Outbound = {
    paymentIntentId: string;
    finalAmountWei?: string | undefined;
    meter?: models.MeteredInput$Outbound | undefined;
};
/** @internal */
export declare const SettleRequest$outboundSchema: z.ZodMiniType<SettleRequest$Outbound, SettleRequest>;
export declare function settleRequestToJSON(settleRequest: SettleRequest): string;
//# sourceMappingURL=settle.d.ts.map
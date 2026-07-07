import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ReceiptLineItem } from "./receipt-line-item.js";
export type ReceiptBody = {
    subject?: string | undefined;
    lineItems?: Array<ReceiptLineItem> | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    providerAmountWei?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    platformFeeWei?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    finalAmountWei?: string | undefined;
    txHash?: string | undefined;
    network?: string | undefined;
    settledAt?: number | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ReceiptBody$inboundSchema: z.ZodMiniType<ReceiptBody, unknown>;
export declare function receiptBodyFromJSON(jsonString: string): SafeParseResult<ReceiptBody, SDKValidationError>;
//# sourceMappingURL=receipt-body.d.ts.map
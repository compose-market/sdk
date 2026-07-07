import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ReceiptLineItem = {
    key: string;
    unit: string;
    quantity: number;
    unitPriceUsd?: number | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    amountWei: string;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ReceiptLineItem$inboundSchema: z.ZodMiniType<ReceiptLineItem, unknown>;
export declare function receiptLineItemFromJSON(jsonString: string): SafeParseResult<ReceiptLineItem, SDKValidationError>;
//# sourceMappingURL=receipt-line-item.d.ts.map
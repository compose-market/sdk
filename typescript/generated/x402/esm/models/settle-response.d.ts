import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type SettleResponse = {
    success: boolean;
    errorReason?: string | undefined;
    errorMessage?: string | undefined;
    payer?: string | undefined;
    transaction?: string | undefined;
    network?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    amount?: string | undefined;
};
/** @internal */
export declare const SettleResponse$inboundSchema: z.ZodMiniType<SettleResponse, unknown>;
export declare function settleResponseFromJSON(jsonString: string): SafeParseResult<SettleResponse, SDKValidationError>;
//# sourceMappingURL=settle-response.d.ts.map
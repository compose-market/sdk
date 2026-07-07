import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
export type PaymentSettleResponse = {
    headers: {
        [k: string]: Array<string>;
    };
    result: models.SettleResponse;
};
/** @internal */
export declare const PaymentSettleResponse$inboundSchema: z.ZodMiniType<PaymentSettleResponse, unknown>;
export declare function paymentSettleResponseFromJSON(jsonString: string): SafeParseResult<PaymentSettleResponse, SDKValidationError>;
//# sourceMappingURL=payment-settle.d.ts.map
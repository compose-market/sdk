import * as z from "zod/v4-mini";
import * as models from "../index.js";
import { SDKError } from "./sdk-error.js";
export type PaymentRequiredErrorData = {
    x402Version: 2;
    error?: string | undefined;
    resource: models.PaymentRequiredResource;
    accepts: Array<models.PaymentRequirements>;
    extensions?: {
        [k: string]: any;
    } | null | undefined;
};
export declare class PaymentRequiredError extends SDKError {
    x402Version: 2;
    error?: string | undefined;
    resource: models.PaymentRequiredResource;
    accepts: Array<models.PaymentRequirements>;
    extensions?: {
        [k: string]: any;
    } | null | undefined;
    /** The original data that was passed to this error instance. */
    data$: PaymentRequiredErrorData;
    constructor(err: PaymentRequiredErrorData, httpMeta: {
        response: Response;
        request: Request;
        body: string;
    });
}
/** @internal */
export declare const PaymentRequiredError$inboundSchema: z.ZodMiniType<PaymentRequiredError, unknown>;
//# sourceMappingURL=payment-required-error.d.ts.map
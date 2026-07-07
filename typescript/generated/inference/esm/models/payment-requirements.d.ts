import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const Scheme: {
    readonly Exact: "exact";
    readonly Upto: "upto";
};
export type Scheme = OpenEnum<typeof Scheme>;
export type PaymentRequirements = {
    scheme: Scheme;
    network: string;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    amount: string;
    asset: string;
    payTo: string;
    maxTimeoutSeconds: number;
    extra?: {
        [k: string]: any;
    } | null | undefined;
};
/** @internal */
export declare const Scheme$inboundSchema: z.ZodMiniType<Scheme, unknown>;
/** @internal */
export declare const PaymentRequirements$inboundSchema: z.ZodMiniType<PaymentRequirements, unknown>;
export declare function paymentRequirementsFromJSON(jsonString: string): SafeParseResult<PaymentRequirements, SDKValidationError>;
//# sourceMappingURL=payment-requirements.d.ts.map
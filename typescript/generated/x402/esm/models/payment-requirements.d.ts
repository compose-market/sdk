import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const PaymentRequirementsScheme: {
    readonly Exact: "exact";
    readonly Upto: "upto";
};
export type PaymentRequirementsScheme = OpenEnum<typeof PaymentRequirementsScheme>;
export type PaymentRequirements = {
    scheme: PaymentRequirementsScheme;
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
export declare const PaymentRequirementsScheme$inboundSchema: z.ZodMiniType<PaymentRequirementsScheme, unknown>;
/** @internal */
export declare const PaymentRequirementsScheme$outboundSchema: z.ZodMiniType<string, PaymentRequirementsScheme>;
/** @internal */
export declare const PaymentRequirements$inboundSchema: z.ZodMiniType<PaymentRequirements, unknown>;
/** @internal */
export type PaymentRequirements$Outbound = {
    scheme: string;
    network: string;
    amount: string;
    asset: string;
    payTo: string;
    maxTimeoutSeconds: number;
    extra?: {
        [k: string]: any;
    } | null | undefined;
};
/** @internal */
export declare const PaymentRequirements$outboundSchema: z.ZodMiniType<PaymentRequirements$Outbound, PaymentRequirements>;
export declare function paymentRequirementsToJSON(paymentRequirements: PaymentRequirements): string;
export declare function paymentRequirementsFromJSON(jsonString: string): SafeParseResult<PaymentRequirements, SDKValidationError>;
//# sourceMappingURL=payment-requirements.d.ts.map
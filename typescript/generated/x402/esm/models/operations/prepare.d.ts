import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
export type PrepareSecurity = {
    keyAuth?: string | undefined;
    x402Payment?: string | undefined;
};
export type PrepareRequest = {
    xSessionUserAddress?: string | undefined;
    xChainId?: number | undefined;
    xX402MaxAmountWei?: string | undefined;
    body: models.PaymentPrepareRequest;
};
export type PrepareResponse = {
    headers: {
        [k: string]: Array<string>;
    };
    result: {
        [k: string]: any;
    };
};
/** @internal */
export type PrepareSecurity$Outbound = {
    KeyAuth?: string | undefined;
    X402Payment?: string | undefined;
};
/** @internal */
export declare const PrepareSecurity$outboundSchema: z.ZodMiniType<PrepareSecurity$Outbound, PrepareSecurity>;
export declare function prepareSecurityToJSON(prepareSecurity: PrepareSecurity): string;
/** @internal */
export type PrepareRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-chain-id"?: number | undefined;
    "x-x402-max-amount-wei"?: string | undefined;
    body: models.PaymentPrepareRequest$Outbound;
};
/** @internal */
export declare const PrepareRequest$outboundSchema: z.ZodMiniType<PrepareRequest$Outbound, PrepareRequest>;
export declare function prepareRequestToJSON(prepareRequest: PrepareRequest): string;
/** @internal */
export declare const PrepareResponse$inboundSchema: z.ZodMiniType<PrepareResponse, unknown>;
export declare function prepareResponseFromJSON(jsonString: string): SafeParseResult<PrepareResponse, SDKValidationError>;
//# sourceMappingURL=prepare.d.ts.map
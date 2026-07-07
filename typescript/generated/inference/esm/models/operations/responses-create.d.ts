import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
export type ResponsesCreateSecurity = {
    keyAuth?: string | undefined;
    x402Payment?: string | undefined;
};
export type ResponsesCreateRequest = {
    xSessionUserAddress?: string | undefined;
    xChainId?: number | undefined;
    xX402MaxAmountWei?: string | undefined;
    xIdempotencyKey?: string | undefined;
    body: models.ResponsesCreateRequest;
};
export type ResponsesCreateResponseResult = models.ResponseObject | string;
export type ResponsesCreateResponse = {
    headers: {
        [k: string]: Array<string>;
    };
    result: models.ResponseObject | string;
};
/** @internal */
export type ResponsesCreateSecurity$Outbound = {
    KeyAuth?: string | undefined;
    X402Payment?: string | undefined;
};
/** @internal */
export declare const ResponsesCreateSecurity$outboundSchema: z.ZodMiniType<ResponsesCreateSecurity$Outbound, ResponsesCreateSecurity>;
export declare function responsesCreateSecurityToJSON(responsesCreateSecurity: ResponsesCreateSecurity): string;
/** @internal */
export type ResponsesCreateRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-chain-id"?: number | undefined;
    "x-x402-max-amount-wei"?: string | undefined;
    "x-idempotency-key"?: string | undefined;
    body: models.ResponsesCreateRequest$Outbound;
};
/** @internal */
export declare const ResponsesCreateRequest$outboundSchema: z.ZodMiniType<ResponsesCreateRequest$Outbound, ResponsesCreateRequest>;
export declare function responsesCreateRequestToJSON(responsesCreateRequest: ResponsesCreateRequest): string;
/** @internal */
export declare const ResponsesCreateResponseResult$inboundSchema: z.ZodMiniType<ResponsesCreateResponseResult, unknown>;
export declare function responsesCreateResponseResultFromJSON(jsonString: string): SafeParseResult<ResponsesCreateResponseResult, SDKValidationError>;
/** @internal */
export declare const ResponsesCreateResponse$inboundSchema: z.ZodMiniType<ResponsesCreateResponse, unknown>;
export declare function responsesCreateResponseFromJSON(jsonString: string): SafeParseResult<ResponsesCreateResponse, SDKValidationError>;
//# sourceMappingURL=responses-create.d.ts.map
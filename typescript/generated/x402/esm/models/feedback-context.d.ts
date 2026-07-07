import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type Endpoint = {
    method?: string | undefined;
    path?: string | undefined;
    url?: string | undefined;
};
export type Receipt = {
    network?: string | undefined;
    txHash?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    finalAmountWei?: string | undefined;
};
export type SDK = {
    name?: string | undefined;
    version?: string | undefined;
};
export type FeedbackContext = {
    requestId?: string | undefined;
    paymentIntentId?: string | undefined;
    runId?: string | undefined;
    chainId?: number | undefined;
    modelId?: string | undefined;
    provider?: string | undefined;
    agentWallet?: string | undefined;
    workflowWallet?: string | undefined;
    endpoint?: Endpoint | undefined;
    receipt?: Receipt | undefined;
    sdk?: SDK | undefined;
};
/** @internal */
export declare const Endpoint$inboundSchema: z.ZodMiniType<Endpoint, unknown>;
/** @internal */
export type Endpoint$Outbound = {
    method?: string | undefined;
    path?: string | undefined;
    url?: string | undefined;
};
/** @internal */
export declare const Endpoint$outboundSchema: z.ZodMiniType<Endpoint$Outbound, Endpoint>;
export declare function endpointToJSON(endpoint: Endpoint): string;
export declare function endpointFromJSON(jsonString: string): SafeParseResult<Endpoint, SDKValidationError>;
/** @internal */
export declare const Receipt$inboundSchema: z.ZodMiniType<Receipt, unknown>;
/** @internal */
export type Receipt$Outbound = {
    network?: string | undefined;
    txHash?: string | undefined;
    finalAmountWei?: string | undefined;
};
/** @internal */
export declare const Receipt$outboundSchema: z.ZodMiniType<Receipt$Outbound, Receipt>;
export declare function receiptToJSON(receipt: Receipt): string;
export declare function receiptFromJSON(jsonString: string): SafeParseResult<Receipt, SDKValidationError>;
/** @internal */
export declare const SDK$inboundSchema: z.ZodMiniType<SDK, unknown>;
/** @internal */
export type SDK$Outbound = {
    name?: string | undefined;
    version?: string | undefined;
};
/** @internal */
export declare const SDK$outboundSchema: z.ZodMiniType<SDK$Outbound, SDK>;
export declare function sdkToJSON(sdk: SDK): string;
export declare function sdkFromJSON(jsonString: string): SafeParseResult<SDK, SDKValidationError>;
/** @internal */
export declare const FeedbackContext$inboundSchema: z.ZodMiniType<FeedbackContext, unknown>;
/** @internal */
export type FeedbackContext$Outbound = {
    requestId?: string | undefined;
    paymentIntentId?: string | undefined;
    runId?: string | undefined;
    chainId?: number | undefined;
    modelId?: string | undefined;
    provider?: string | undefined;
    agentWallet?: string | undefined;
    workflowWallet?: string | undefined;
    endpoint?: Endpoint$Outbound | undefined;
    receipt?: Receipt$Outbound | undefined;
    sdk?: SDK$Outbound | undefined;
};
/** @internal */
export declare const FeedbackContext$outboundSchema: z.ZodMiniType<FeedbackContext$Outbound, FeedbackContext>;
export declare function feedbackContextToJSON(feedbackContext: FeedbackContext): string;
export declare function feedbackContextFromJSON(jsonString: string): SafeParseResult<FeedbackContext, SDKValidationError>;
//# sourceMappingURL=feedback-context.d.ts.map
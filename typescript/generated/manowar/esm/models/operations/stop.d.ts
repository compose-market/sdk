import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
/**
 * Production API gateway for public workflow execution.
 */
export declare const StopServerComposeApi = "compose-api";
export declare const StopServerList: {
    "compose-api": string;
};
export type StopRequestBody = {
    threadId?: string | undefined;
    runId?: string | undefined;
};
export type StopRequest = {
    walletAddress: string;
    body: StopRequestBody;
};
/**
 * Workflow cancellation accepted.
 */
export type StopResponse = {
    success: boolean;
    runId: string;
};
/** @internal */
export type StopRequestBody$Outbound = {
    threadId?: string | undefined;
    runId?: string | undefined;
};
/** @internal */
export declare const StopRequestBody$outboundSchema: z.ZodMiniType<StopRequestBody$Outbound, StopRequestBody>;
export declare function stopRequestBodyToJSON(stopRequestBody: StopRequestBody): string;
/** @internal */
export type StopRequest$Outbound = {
    walletAddress: string;
    body: StopRequestBody$Outbound;
};
/** @internal */
export declare const StopRequest$outboundSchema: z.ZodMiniType<StopRequest$Outbound, StopRequest>;
export declare function stopRequestToJSON(stopRequest: StopRequest): string;
/** @internal */
export declare const StopResponse$inboundSchema: z.ZodMiniType<StopResponse, unknown>;
export declare function stopResponseFromJSON(jsonString: string): SafeParseResult<StopResponse, SDKValidationError>;
//# sourceMappingURL=stop.d.ts.map
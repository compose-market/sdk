import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
/**
 * Production API gateway for public agent execution.
 */
export declare const StreamCreateServerComposeApi = "compose-api";
export declare const StreamCreateServerList: {
    "compose-api": string;
};
export type StreamCreateRequest = {
    walletAddress: string;
    xSessionUserAddress?: string | undefined;
    xSessionActive?: models.SessionActiveHeader | undefined;
    xSessionBudgetRemaining?: string | undefined;
    body: models.AgentStreamRequest;
};
export type StreamCreateResponse = {
    headers: {
        [k: string]: Array<string>;
    };
    result: string;
};
/** @internal */
export type StreamCreateRequest$Outbound = {
    walletAddress: string;
    "x-session-user-address"?: string | undefined;
    "x-session-active"?: string | undefined;
    "x-session-budget-remaining"?: string | undefined;
    body: models.AgentStreamRequest$Outbound;
};
/** @internal */
export declare const StreamCreateRequest$outboundSchema: z.ZodMiniType<StreamCreateRequest$Outbound, StreamCreateRequest>;
export declare function streamCreateRequestToJSON(streamCreateRequest: StreamCreateRequest): string;
/** @internal */
export declare const StreamCreateResponse$inboundSchema: z.ZodMiniType<StreamCreateResponse, unknown>;
export declare function streamCreateResponseFromJSON(jsonString: string): SafeParseResult<StreamCreateResponse, SDKValidationError>;
//# sourceMappingURL=stream-create.d.ts.map
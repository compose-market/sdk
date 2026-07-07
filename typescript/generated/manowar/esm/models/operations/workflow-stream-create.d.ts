import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
/**
 * Production API gateway for public workflow execution.
 */
export declare const WorkflowStreamCreateServerComposeApi = "compose-api";
export declare const WorkflowStreamCreateServerList: {
    "compose-api": string;
};
export type WorkflowStreamCreateRequest = {
    walletAddress: string;
    xSessionUserAddress?: string | undefined;
    xSessionActive?: models.SessionActiveHeader | undefined;
    xSessionBudgetRemaining?: string | undefined;
    body: models.WorkflowStreamRequest;
};
export type WorkflowStreamCreateResponse = {
    headers: {
        [k: string]: Array<string>;
    };
    result: string;
};
/** @internal */
export type WorkflowStreamCreateRequest$Outbound = {
    walletAddress: string;
    "x-session-user-address"?: string | undefined;
    "x-session-active"?: string | undefined;
    "x-session-budget-remaining"?: string | undefined;
    body: models.WorkflowStreamRequest$Outbound;
};
/** @internal */
export declare const WorkflowStreamCreateRequest$outboundSchema: z.ZodMiniType<WorkflowStreamCreateRequest$Outbound, WorkflowStreamCreateRequest>;
export declare function workflowStreamCreateRequestToJSON(workflowStreamCreateRequest: WorkflowStreamCreateRequest): string;
/** @internal */
export declare const WorkflowStreamCreateResponse$inboundSchema: z.ZodMiniType<WorkflowStreamCreateResponse, unknown>;
export declare function workflowStreamCreateResponseFromJSON(jsonString: string): SafeParseResult<WorkflowStreamCreateResponse, SDKValidationError>;
//# sourceMappingURL=workflow-stream-create.d.ts.map
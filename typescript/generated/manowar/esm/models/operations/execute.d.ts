import * as z from "zod/v4-mini";
import * as models from "../index.js";
/**
 * Production API gateway for public workflow execution.
 */
export declare const ExecuteServerComposeApi = "compose-api";
export declare const ExecuteServerList: {
    "compose-api": string;
};
export type ExecuteRequestBody = {
    payload: models.WorkflowExecutePayload;
};
export type ExecuteRequest = {
    xSessionUserAddress?: string | undefined;
    xSessionActive?: models.SessionActiveHeader | undefined;
    xSessionBudgetRemaining?: string | undefined;
    body: ExecuteRequestBody;
};
/** @internal */
export type ExecuteRequestBody$Outbound = {
    payload: models.WorkflowExecutePayload$Outbound;
};
/** @internal */
export declare const ExecuteRequestBody$outboundSchema: z.ZodMiniType<ExecuteRequestBody$Outbound, ExecuteRequestBody>;
export declare function executeRequestBodyToJSON(executeRequestBody: ExecuteRequestBody): string;
/** @internal */
export type ExecuteRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-session-active"?: string | undefined;
    "x-session-budget-remaining"?: string | undefined;
    body: ExecuteRequestBody$Outbound;
};
/** @internal */
export declare const ExecuteRequest$outboundSchema: z.ZodMiniType<ExecuteRequest$Outbound, ExecuteRequest>;
export declare function executeRequestToJSON(executeRequest: ExecuteRequest): string;
//# sourceMappingURL=execute.d.ts.map
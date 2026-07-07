import * as z from "zod/v4-mini";
/**
 * Production API gateway for public workflow run state.
 */
export declare const WorkflowRunsStateGetServerComposeApi = "compose-api";
export declare const WorkflowRunsStateGetServerList: {
    "compose-api": string;
};
export type WorkflowRunsStateGetRequest = {
    walletAddress: string;
    runId: string;
};
/** @internal */
export type WorkflowRunsStateGetRequest$Outbound = {
    walletAddress: string;
    runId: string;
};
/** @internal */
export declare const WorkflowRunsStateGetRequest$outboundSchema: z.ZodMiniType<WorkflowRunsStateGetRequest$Outbound, WorkflowRunsStateGetRequest>;
export declare function workflowRunsStateGetRequestToJSON(workflowRunsStateGetRequest: WorkflowRunsStateGetRequest): string;
//# sourceMappingURL=workflow-runs-state-get.d.ts.map
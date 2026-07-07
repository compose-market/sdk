import * as z from "zod/v4-mini";
import * as models from "../index.js";
/**
 * Production API gateway for public workflow execution.
 */
export declare const RunAliasServerComposeApi = "compose-api";
export declare const RunAliasServerList: {
    "compose-api": string;
};
export type RunAliasRequest = {
    id: string;
    body: models.WorkflowStreamRequest;
};
/** @internal */
export type RunAliasRequest$Outbound = {
    id: string;
    body: models.WorkflowStreamRequest$Outbound;
};
/** @internal */
export declare const RunAliasRequest$outboundSchema: z.ZodMiniType<RunAliasRequest$Outbound, RunAliasRequest>;
export declare function runAliasRequestToJSON(runAliasRequest: RunAliasRequest): string;
//# sourceMappingURL=run-alias.d.ts.map
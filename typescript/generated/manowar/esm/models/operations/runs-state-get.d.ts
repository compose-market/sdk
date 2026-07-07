import * as z from "zod/v4-mini";
/**
 * Production API gateway for public agent run state.
 */
export declare const RunsStateGetServerComposeApi = "compose-api";
export declare const RunsStateGetServerList: {
    "compose-api": string;
};
export type RunsStateGetRequest = {
    walletAddress: string;
    runId: string;
    threadId: string;
};
/** @internal */
export type RunsStateGetRequest$Outbound = {
    walletAddress: string;
    runId: string;
    threadId: string;
};
/** @internal */
export declare const RunsStateGetRequest$outboundSchema: z.ZodMiniType<RunsStateGetRequest$Outbound, RunsStateGetRequest>;
export declare function runsStateGetRequestToJSON(runsStateGetRequest: RunsStateGetRequest): string;
//# sourceMappingURL=runs-state-get.d.ts.map
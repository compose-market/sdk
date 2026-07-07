import * as z from "zod/v4-mini";
export type StatsGetRequest = {
    agentWallet: string;
};
/** @internal */
export type StatsGetRequest$Outbound = {
    agentWallet: string;
};
/** @internal */
export declare const StatsGetRequest$outboundSchema: z.ZodMiniType<StatsGetRequest$Outbound, StatsGetRequest>;
export declare function statsGetRequestToJSON(statsGetRequest: StatsGetRequest): string;
//# sourceMappingURL=stats-get.d.ts.map
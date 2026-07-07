import * as z from "zod/v4-mini";
export type SchedulesListRequest = {
    agentWallets?: Array<string> | undefined;
};
/** @internal */
export type SchedulesListRequest$Outbound = {
    agentWallets?: Array<string> | undefined;
};
/** @internal */
export declare const SchedulesListRequest$outboundSchema: z.ZodMiniType<SchedulesListRequest$Outbound, SchedulesListRequest>;
export declare function schedulesListRequestToJSON(schedulesListRequest: SchedulesListRequest): string;
//# sourceMappingURL=schedules-list.d.ts.map
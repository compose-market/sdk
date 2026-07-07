import * as z from "zod/v4-mini";
export type SchedulesDeleteRequest = {
    agentWallets?: Array<string> | undefined;
};
/** @internal */
export type SchedulesDeleteRequest$Outbound = {
    agentWallets?: Array<string> | undefined;
};
/** @internal */
export declare const SchedulesDeleteRequest$outboundSchema: z.ZodMiniType<SchedulesDeleteRequest$Outbound, SchedulesDeleteRequest>;
export declare function schedulesDeleteRequestToJSON(schedulesDeleteRequest: SchedulesDeleteRequest): string;
//# sourceMappingURL=schedules-delete.d.ts.map
import * as z from "zod/v4-mini";
export type SchedulesTriggerRequest = {
    scheduleId: string;
};
/** @internal */
export type SchedulesTriggerRequest$Outbound = {
    scheduleId: string;
};
/** @internal */
export declare const SchedulesTriggerRequest$outboundSchema: z.ZodMiniType<SchedulesTriggerRequest$Outbound, SchedulesTriggerRequest>;
export declare function schedulesTriggerRequestToJSON(schedulesTriggerRequest: SchedulesTriggerRequest): string;
//# sourceMappingURL=schedules-trigger.d.ts.map
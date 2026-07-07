import * as z from "zod/v4-mini";
export type SchedulesPauseRequest = {
    scheduleId: string;
};
/** @internal */
export type SchedulesPauseRequest$Outbound = {
    scheduleId: string;
};
/** @internal */
export declare const SchedulesPauseRequest$outboundSchema: z.ZodMiniType<SchedulesPauseRequest$Outbound, SchedulesPauseRequest>;
export declare function schedulesPauseRequestToJSON(schedulesPauseRequest: SchedulesPauseRequest): string;
//# sourceMappingURL=schedules-pause.d.ts.map
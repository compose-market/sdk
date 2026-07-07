import * as z from "zod/v4-mini";
export type SchedulesResumeRequest = {
    scheduleId: string;
};
/** @internal */
export type SchedulesResumeRequest$Outbound = {
    scheduleId: string;
};
/** @internal */
export declare const SchedulesResumeRequest$outboundSchema: z.ZodMiniType<SchedulesResumeRequest$Outbound, SchedulesResumeRequest>;
export declare function schedulesResumeRequestToJSON(schedulesResumeRequest: SchedulesResumeRequest): string;
//# sourceMappingURL=schedules-resume.d.ts.map
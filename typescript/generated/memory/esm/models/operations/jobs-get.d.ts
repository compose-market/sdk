import * as z from "zod/v4-mini";
export type JobsGetRequest = {
    jobId: string;
};
/** @internal */
export type JobsGetRequest$Outbound = {
    jobId: string;
};
/** @internal */
export declare const JobsGetRequest$outboundSchema: z.ZodMiniType<JobsGetRequest$Outbound, JobsGetRequest>;
export declare function jobsGetRequestToJSON(jobsGetRequest: JobsGetRequest): string;
//# sourceMappingURL=jobs-get.d.ts.map
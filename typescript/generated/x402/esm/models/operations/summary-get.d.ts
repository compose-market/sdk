import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type SummaryGetRequest = {
    targetType: models.FeedbackTargetType;
    targetId: string;
    recentLimit?: number | undefined;
};
/** @internal */
export type SummaryGetRequest$Outbound = {
    targetType: string;
    targetId: string;
    recentLimit?: number | undefined;
};
/** @internal */
export declare const SummaryGetRequest$outboundSchema: z.ZodMiniType<SummaryGetRequest$Outbound, SummaryGetRequest>;
export declare function summaryGetRequestToJSON(summaryGetRequest: SummaryGetRequest): string;
//# sourceMappingURL=summary-get.d.ts.map
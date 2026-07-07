import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type FeedbackListRequest = {
    targetType: models.FeedbackTargetType;
    targetId: string;
    limit?: number | undefined;
};
/** @internal */
export type FeedbackListRequest$Outbound = {
    targetType: string;
    targetId: string;
    limit?: number | undefined;
};
/** @internal */
export declare const FeedbackListRequest$outboundSchema: z.ZodMiniType<FeedbackListRequest$Outbound, FeedbackListRequest>;
export declare function feedbackListRequestToJSON(feedbackListRequest: FeedbackListRequest): string;
//# sourceMappingURL=feedback-list.d.ts.map
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Feedback extends ClientSDK {
    submit(request: operations.SubmitRequest, options?: RequestOptions): Promise<models.FeedbackSubmitResponse>;
    list(request: operations.FeedbackListRequest, options?: RequestOptions): Promise<models.FeedbackListResponse>;
    summaryGet(request: operations.SummaryGetRequest, options?: RequestOptions): Promise<models.FeedbackSummary>;
}
//# sourceMappingURL=feedback.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FeedbackRecord } from "./feedback-record.js";
export type FeedbackListResponse = {
    object: "list";
    data: Array<FeedbackRecord>;
};
/** @internal */
export declare const FeedbackListResponse$inboundSchema: z.ZodMiniType<FeedbackListResponse, unknown>;
export declare function feedbackListResponseFromJSON(jsonString: string): SafeParseResult<FeedbackListResponse, SDKValidationError>;
//# sourceMappingURL=feedback-list-response.d.ts.map
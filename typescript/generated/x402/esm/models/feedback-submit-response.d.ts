import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FeedbackTarget } from "./feedback-target.js";
import { FeedbackVerificationKind } from "./feedback-verification-kind.js";
export type FeedbackSubmitResponse = {
    feedbackId: string;
    target: FeedbackTarget;
    verification: FeedbackVerificationKind;
    createdAt: number;
};
/** @internal */
export declare const FeedbackSubmitResponse$inboundSchema: z.ZodMiniType<FeedbackSubmitResponse, unknown>;
export declare function feedbackSubmitResponseFromJSON(jsonString: string): SafeParseResult<FeedbackSubmitResponse, SDKValidationError>;
//# sourceMappingURL=feedback-submit-response.d.ts.map
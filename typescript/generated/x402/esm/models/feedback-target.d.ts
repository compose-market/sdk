import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FeedbackTargetType } from "./feedback-target-type.js";
export type FeedbackTarget = {
    type: FeedbackTargetType;
    id: string;
};
/** @internal */
export declare const FeedbackTarget$inboundSchema: z.ZodMiniType<FeedbackTarget, unknown>;
/** @internal */
export type FeedbackTarget$Outbound = {
    type: string;
    id: string;
};
/** @internal */
export declare const FeedbackTarget$outboundSchema: z.ZodMiniType<FeedbackTarget$Outbound, FeedbackTarget>;
export declare function feedbackTargetToJSON(feedbackTarget: FeedbackTarget): string;
export declare function feedbackTargetFromJSON(jsonString: string): SafeParseResult<FeedbackTarget, SDKValidationError>;
//# sourceMappingURL=feedback-target.d.ts.map
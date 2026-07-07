import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FeedbackCategory } from "./feedback-category.js";
import { FeedbackContext } from "./feedback-context.js";
import { FeedbackTarget } from "./feedback-target.js";
import { FeedbackVerificationKind } from "./feedback-verification-kind.js";
export type FeedbackRecord = {
    id: string;
    target: FeedbackTarget;
    category: FeedbackCategory;
    rating?: number | undefined;
    message?: string | undefined;
    labels: Array<string>;
    context: FeedbackContext;
    metadata: {
        [k: string]: any;
    };
    verification: FeedbackVerificationKind;
    createdAt: number;
};
/** @internal */
export declare const FeedbackRecord$inboundSchema: z.ZodMiniType<FeedbackRecord, unknown>;
export declare function feedbackRecordFromJSON(jsonString: string): SafeParseResult<FeedbackRecord, SDKValidationError>;
//# sourceMappingURL=feedback-record.d.ts.map
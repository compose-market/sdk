import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FeedbackRecord } from "./feedback-record.js";
import { FeedbackTarget } from "./feedback-target.js";
export type Ratings = {
    one: number;
    two: number;
    three: number;
    four: number;
    five: number;
};
export type Verification = {
    anonymous: number;
    walletHeader: number;
    composeKey: number;
};
export type FeedbackSummary = {
    target: FeedbackTarget;
    count: number;
    ratingCount: number;
    ratingAverage: number | null;
    ratings: Ratings;
    categories: {
        [k: string]: number;
    };
    verification: Verification;
    recent: Array<FeedbackRecord>;
};
/** @internal */
export declare const Ratings$inboundSchema: z.ZodMiniType<Ratings, unknown>;
export declare function ratingsFromJSON(jsonString: string): SafeParseResult<Ratings, SDKValidationError>;
/** @internal */
export declare const Verification$inboundSchema: z.ZodMiniType<Verification, unknown>;
export declare function verificationFromJSON(jsonString: string): SafeParseResult<Verification, SDKValidationError>;
/** @internal */
export declare const FeedbackSummary$inboundSchema: z.ZodMiniType<FeedbackSummary, unknown>;
export declare function feedbackSummaryFromJSON(jsonString: string): SafeParseResult<FeedbackSummary, SDKValidationError>;
//# sourceMappingURL=feedback-summary.d.ts.map
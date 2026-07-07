import * as z from "zod/v4-mini";
import { FeedbackCategory } from "./feedback-category.js";
import { FeedbackContext, FeedbackContext$Outbound } from "./feedback-context.js";
import { FeedbackTarget, FeedbackTarget$Outbound } from "./feedback-target.js";
export type FeedbackSubmitRequest2 = {
    target: FeedbackTarget;
    category?: FeedbackCategory | undefined;
    rating?: number | undefined;
    message: string;
    labels?: Array<string> | undefined;
    context?: FeedbackContext | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
export type FeedbackSubmitRequest1 = {
    target: FeedbackTarget;
    category?: FeedbackCategory | undefined;
    rating: number;
    message?: string | undefined;
    labels?: Array<string> | undefined;
    context?: FeedbackContext | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
export type FeedbackSubmitRequestUnion = FeedbackSubmitRequest1 | FeedbackSubmitRequest2;
/** @internal */
export type FeedbackSubmitRequest2$Outbound = {
    target: FeedbackTarget$Outbound;
    category?: string | undefined;
    rating?: number | undefined;
    message: string;
    labels?: Array<string> | undefined;
    context?: FeedbackContext$Outbound | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const FeedbackSubmitRequest2$outboundSchema: z.ZodMiniType<FeedbackSubmitRequest2$Outbound, FeedbackSubmitRequest2>;
export declare function feedbackSubmitRequest2ToJSON(feedbackSubmitRequest2: FeedbackSubmitRequest2): string;
/** @internal */
export type FeedbackSubmitRequest1$Outbound = {
    target: FeedbackTarget$Outbound;
    category?: string | undefined;
    rating: number;
    message?: string | undefined;
    labels?: Array<string> | undefined;
    context?: FeedbackContext$Outbound | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const FeedbackSubmitRequest1$outboundSchema: z.ZodMiniType<FeedbackSubmitRequest1$Outbound, FeedbackSubmitRequest1>;
export declare function feedbackSubmitRequest1ToJSON(feedbackSubmitRequest1: FeedbackSubmitRequest1): string;
/** @internal */
export type FeedbackSubmitRequestUnion$Outbound = FeedbackSubmitRequest1$Outbound | FeedbackSubmitRequest2$Outbound;
/** @internal */
export declare const FeedbackSubmitRequestUnion$outboundSchema: z.ZodMiniType<FeedbackSubmitRequestUnion$Outbound, FeedbackSubmitRequestUnion>;
export declare function feedbackSubmitRequestUnionToJSON(feedbackSubmitRequestUnion: FeedbackSubmitRequestUnion): string;
//# sourceMappingURL=feedback-submit-request-union.d.ts.map
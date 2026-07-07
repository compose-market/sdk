import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const FeedbackCategory: {
    readonly General: "general";
    readonly Bug: "bug";
    readonly Latency: "latency";
    readonly Quality: "quality";
    readonly Pricing: "pricing";
    readonly Settlement: "settlement";
    readonly ModelCapability: "model_capability";
    readonly Safety: "safety";
    readonly Docs: "docs";
    readonly Integration: "integration";
};
export type FeedbackCategory = OpenEnum<typeof FeedbackCategory>;
/** @internal */
export declare const FeedbackCategory$inboundSchema: z.ZodMiniType<FeedbackCategory, unknown>;
/** @internal */
export declare const FeedbackCategory$outboundSchema: z.ZodMiniType<string, FeedbackCategory>;
//# sourceMappingURL=feedback-category.d.ts.map
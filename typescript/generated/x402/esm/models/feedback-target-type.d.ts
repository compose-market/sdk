import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const FeedbackTargetType: {
    readonly Endpoint: "endpoint";
    readonly X402: "x402";
    readonly Model: "model";
    readonly Agent: "agent";
    readonly Workflow: "workflow";
};
export type FeedbackTargetType = OpenEnum<typeof FeedbackTargetType>;
/** @internal */
export declare const FeedbackTargetType$inboundSchema: z.ZodMiniType<FeedbackTargetType, unknown>;
/** @internal */
export declare const FeedbackTargetType$outboundSchema: z.ZodMiniType<string, FeedbackTargetType>;
//# sourceMappingURL=feedback-target-type.d.ts.map
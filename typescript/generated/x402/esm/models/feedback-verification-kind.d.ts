import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const FeedbackVerificationKind: {
    readonly Anonymous: "anonymous";
    readonly WalletHeader: "wallet_header";
    readonly ComposeKey: "compose_key";
};
export type FeedbackVerificationKind = OpenEnum<typeof FeedbackVerificationKind>;
/** @internal */
export declare const FeedbackVerificationKind$inboundSchema: z.ZodMiniType<FeedbackVerificationKind, unknown>;
//# sourceMappingURL=feedback-verification-kind.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type SubmitRequest = {
    xSessionUserAddress?: string | undefined;
    xChainId?: number | undefined;
    body: models.FeedbackSubmitRequestUnion;
};
/** @internal */
export type SubmitRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-chain-id"?: number | undefined;
    body: models.FeedbackSubmitRequestUnion$Outbound;
};
/** @internal */
export declare const SubmitRequest$outboundSchema: z.ZodMiniType<SubmitRequest$Outbound, SubmitRequest>;
export declare function submitRequestToJSON(submitRequest: SubmitRequest): string;
//# sourceMappingURL=submit.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type StatusRequest = {
    channel: models.ChannelName;
    userAddress: string;
    agentWallet: string;
    /**
     * Route scope. Omit or use global for hosted/global ties; use local with haiId for HAI-bound local ties.
     */
    scope?: models.ChannelScope | undefined;
    /**
     * Required when scope is local.
     */
    haiId?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | undefined;
};
/** @internal */
export type StatusRequest$Outbound = {
    channel: string;
    userAddress: string;
    agentWallet: string;
    scope?: string | undefined;
    haiId?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | undefined;
};
/** @internal */
export declare const StatusRequest$outboundSchema: z.ZodMiniType<StatusRequest$Outbound, StatusRequest>;
export declare function statusRequestToJSON(statusRequest: StatusRequest): string;
//# sourceMappingURL=status.d.ts.map
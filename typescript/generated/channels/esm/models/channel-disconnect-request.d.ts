import * as z from "zod/v4-mini";
import { ChannelScope } from "./channel-scope.js";
export type ChannelDisconnectRequest = {
    userAddress?: string | undefined;
    agentWallet: string;
    /**
     * Channel route scope. Local scope requires haiId.
     */
    scope?: ChannelScope | undefined;
    haiId?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | undefined;
};
/** @internal */
export type ChannelDisconnectRequest$Outbound = {
    userAddress?: string | undefined;
    agentWallet: string;
    scope?: string | undefined;
    haiId?: string | undefined;
    accountId?: string | undefined;
    threadId?: string | undefined;
};
/** @internal */
export declare const ChannelDisconnectRequest$outboundSchema: z.ZodMiniType<ChannelDisconnectRequest$Outbound, ChannelDisconnectRequest>;
export declare function channelDisconnectRequestToJSON(channelDisconnectRequest: ChannelDisconnectRequest): string;
//# sourceMappingURL=channel-disconnect-request.d.ts.map
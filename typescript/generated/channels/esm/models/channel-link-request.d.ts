import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { ChannelScope } from "./channel-scope.js";
/**
 * Linking mode (guild for Slack/Discord server-level linking)
 */
export declare const ChannelLinkRequestMode: {
    readonly User: "user";
    readonly Guild: "guild";
};
/**
 * Linking mode (guild for Slack/Discord server-level linking)
 */
export type ChannelLinkRequestMode = ClosedEnum<typeof ChannelLinkRequestMode>;
export declare const ChannelLinkRequestPrivacy: {
    readonly Public: "public";
    readonly Private: "private";
};
export type ChannelLinkRequestPrivacy = ClosedEnum<typeof ChannelLinkRequestPrivacy>;
export type ChannelLinkRequest = {
    /**
     * User wallet address (inferred from x-session-user-address header if omitted)
     */
    userAddress?: string | undefined;
    /**
     * Agent wallet address to link
     */
    agentWallet: string;
    /**
     * Channel route scope. Local scope requires haiId.
     */
    scope?: ChannelScope | undefined;
    /**
     * Required when scope is local.
     */
    haiId?: string | undefined;
    /**
     * Display name for the agent on the channel
     */
    agentName?: string | undefined;
    /**
     * Linking mode (guild for Slack/Discord server-level linking)
     */
    mode?: ChannelLinkRequestMode | undefined;
    privacy?: ChannelLinkRequestPrivacy | undefined;
};
/** @internal */
export declare const ChannelLinkRequestMode$outboundSchema: z.ZodMiniEnum<typeof ChannelLinkRequestMode>;
/** @internal */
export declare const ChannelLinkRequestPrivacy$outboundSchema: z.ZodMiniEnum<typeof ChannelLinkRequestPrivacy>;
/** @internal */
export type ChannelLinkRequest$Outbound = {
    userAddress?: string | undefined;
    agentWallet: string;
    scope?: string | undefined;
    haiId?: string | undefined;
    agentName?: string | undefined;
    mode: string;
    privacy: string;
};
/** @internal */
export declare const ChannelLinkRequest$outboundSchema: z.ZodMiniType<ChannelLinkRequest$Outbound, ChannelLinkRequest>;
export declare function channelLinkRequestToJSON(channelLinkRequest: ChannelLinkRequest): string;
//# sourceMappingURL=channel-link-request.d.ts.map
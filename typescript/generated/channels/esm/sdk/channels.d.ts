import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Channels extends ClientSDK {
    /**
     * List available channels
     */
    list(options?: RequestOptions): Promise<models.ChannelListResponse>;
    /**
     * Get channel info and available endpoints
     */
    get(request: operations.GetRequest, options?: RequestOptions): Promise<models.ChannelGetResponse>;
    /**
     * Create a linking code for a channel
     *
     * @remarks
     * Generates a short-lived linking code that pairs a user's wallet with an agent
     * on the specified channel. The response includes a URL or action that the user
     * must follow to complete the linking process (QR code for WhatsApp, OAuth redirect
     * for Slack/Discord, bot link for Telegram).
     */
    link(request: operations.LinkRequest, options?: RequestOptions): Promise<models.ChannelLinkResponse>;
    /**
     * Check connection status and list routes
     */
    status(request: operations.StatusRequest, options?: RequestOptions): Promise<models.ChannelStatusResponse>;
    /**
     * Disconnect routes for a channel
     */
    disconnect(request: operations.DisconnectRequest, options?: RequestOptions): Promise<models.ChannelDisconnectResponse>;
    /**
     * Get Slack app manifest
     */
    slackManifest(options?: RequestOptions): Promise<operations.SlackManifestResponse>;
}
//# sourceMappingURL=channels.d.ts.map
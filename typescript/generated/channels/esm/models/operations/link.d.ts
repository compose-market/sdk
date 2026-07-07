import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type LinkRequest = {
    channel: models.ChannelName;
    body: models.ChannelLinkRequest;
};
/** @internal */
export type LinkRequest$Outbound = {
    channel: string;
    body: models.ChannelLinkRequest$Outbound;
};
/** @internal */
export declare const LinkRequest$outboundSchema: z.ZodMiniType<LinkRequest$Outbound, LinkRequest>;
export declare function linkRequestToJSON(linkRequest: LinkRequest): string;
//# sourceMappingURL=link.d.ts.map
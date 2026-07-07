import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const ChannelName: {
    readonly Telegram: "telegram";
    readonly Slack: "slack";
    readonly Discord: "discord";
    readonly Whatsapp: "whatsapp";
};
export type ChannelName = OpenEnum<typeof ChannelName>;
/** @internal */
export declare const ChannelName$inboundSchema: z.ZodMiniType<ChannelName, unknown>;
/** @internal */
export declare const ChannelName$outboundSchema: z.ZodMiniType<string, ChannelName>;
//# sourceMappingURL=channel-name.d.ts.map
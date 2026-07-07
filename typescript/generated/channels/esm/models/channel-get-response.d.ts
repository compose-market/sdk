import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ChannelGetResponse = {
    channel: ChannelName;
    /**
     * URL for creating a link
     */
    link: string;
    /**
     * URL for checking status
     */
    status: string;
    /**
     * URL for disconnecting
     */
    disconnect: string;
    /**
     * Webhook URL for platform callbacks (Telegram/Slack/Discord)
     */
    webhook?: string | null | undefined;
    /**
     * WebSocket URL for pairing (WhatsApp)
     */
    socket?: string | null | undefined;
};
/** @internal */
export declare const ChannelGetResponse$inboundSchema: z.ZodMiniType<ChannelGetResponse, unknown>;
export declare function channelGetResponseFromJSON(jsonString: string): SafeParseResult<ChannelGetResponse, SDKValidationError>;
//# sourceMappingURL=channel-get-response.d.ts.map
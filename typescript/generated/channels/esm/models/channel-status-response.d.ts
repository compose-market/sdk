import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { ChannelRoute } from "./channel-route.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ChannelStatusResponse = {
    channel: ChannelName;
    connected: boolean;
    routes: Array<ChannelRoute>;
};
/** @internal */
export declare const ChannelStatusResponse$inboundSchema: z.ZodMiniType<ChannelStatusResponse, unknown>;
export declare function channelStatusResponseFromJSON(jsonString: string): SafeParseResult<ChannelStatusResponse, SDKValidationError>;
//# sourceMappingURL=channel-status-response.d.ts.map
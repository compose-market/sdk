import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ChannelDisconnectResponse = {
    channel: ChannelName;
    /**
     * Number of routes disconnected
     */
    disconnected: number;
};
/** @internal */
export declare const ChannelDisconnectResponse$inboundSchema: z.ZodMiniType<ChannelDisconnectResponse, unknown>;
export declare function channelDisconnectResponseFromJSON(jsonString: string): SafeParseResult<ChannelDisconnectResponse, SDKValidationError>;
//# sourceMappingURL=channel-disconnect-response.d.ts.map
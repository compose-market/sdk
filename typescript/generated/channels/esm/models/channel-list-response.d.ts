import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ChannelListResponse = {
    channels: Array<ChannelName>;
};
/** @internal */
export declare const ChannelListResponse$inboundSchema: z.ZodMiniType<ChannelListResponse, unknown>;
export declare function channelListResponseFromJSON(jsonString: string): SafeParseResult<ChannelListResponse, SDKValidationError>;
//# sourceMappingURL=channel-list-response.d.ts.map
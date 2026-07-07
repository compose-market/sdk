import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { ChannelScope } from "./channel-scope.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ChannelRoute = {
    id: string;
    channel: ChannelName;
    userAddress: string;
    agentWallet: string;
    /**
     * Channel route scope. Local scope requires haiId.
     */
    scope: ChannelScope;
    haiId?: string | undefined;
    /**
     * Platform-specific account identifier (chat ID, channel ID, etc.)
     */
    accountId: string;
    /**
     * Platform-specific thread/conversation identifier
     */
    threadId: string;
    label?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    createdAt: number;
    updatedAt: number;
};
/** @internal */
export declare const ChannelRoute$inboundSchema: z.ZodMiniType<ChannelRoute, unknown>;
export declare function channelRouteFromJSON(jsonString: string): SafeParseResult<ChannelRoute, SDKValidationError>;
//# sourceMappingURL=channel-route.d.ts.map
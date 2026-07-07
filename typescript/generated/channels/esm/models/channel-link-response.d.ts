import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { ChannelName } from "./channel-name.js";
import { ChannelScope } from "./channel-scope.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const ChannelLinkResponseMode: {
    readonly User: "user";
    readonly Guild: "guild";
};
export type ChannelLinkResponseMode = OpenEnum<typeof ChannelLinkResponseMode>;
export declare const ChannelLinkResponsePrivacy: {
    readonly Public: "public";
    readonly Private: "private";
};
export type ChannelLinkResponsePrivacy = OpenEnum<typeof ChannelLinkResponsePrivacy>;
export declare const Type: {
    readonly Redirect: "redirect";
    readonly Websocket: "websocket";
    readonly Oauth: "oauth";
};
export type Type = OpenEnum<typeof Type>;
export type Action = {
    type?: Type | undefined;
    label?: string | undefined;
    url?: string | null | undefined;
    socket?: string | undefined;
    command?: string | undefined;
};
export type ChannelLinkResponse = {
    /**
     * Short-lived linking code (10 min TTL)
     */
    code: string;
    channel: ChannelName;
    userAddress: string;
    agentWallet: string;
    /**
     * Channel route scope. Local scope requires haiId.
     */
    scope: ChannelScope;
    haiId?: string | undefined;
    agentName?: string | undefined;
    mode?: ChannelLinkResponseMode | undefined;
    privacy?: ChannelLinkResponsePrivacy | undefined;
    /**
     * Unix timestamp (ms)
     */
    createdAt: number;
    /**
     * Unix timestamp (ms)
     */
    expiresAt: number;
    /**
     * URL the user should visit to complete linking
     */
    url?: string | null | undefined;
    action?: Action | undefined;
};
/** @internal */
export declare const ChannelLinkResponseMode$inboundSchema: z.ZodMiniType<ChannelLinkResponseMode, unknown>;
/** @internal */
export declare const ChannelLinkResponsePrivacy$inboundSchema: z.ZodMiniType<ChannelLinkResponsePrivacy, unknown>;
/** @internal */
export declare const Type$inboundSchema: z.ZodMiniType<Type, unknown>;
/** @internal */
export declare const Action$inboundSchema: z.ZodMiniType<Action, unknown>;
export declare function actionFromJSON(jsonString: string): SafeParseResult<Action, SDKValidationError>;
/** @internal */
export declare const ChannelLinkResponse$inboundSchema: z.ZodMiniType<ChannelLinkResponse, unknown>;
export declare function channelLinkResponseFromJSON(jsonString: string): SafeParseResult<ChannelLinkResponse, SDKValidationError>;
//# sourceMappingURL=channel-link-response.d.ts.map
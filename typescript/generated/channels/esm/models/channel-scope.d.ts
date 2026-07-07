import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
/**
 * Channel route scope. Local scope requires haiId.
 */
export declare const ChannelScope: {
    readonly Global: "global";
    readonly Local: "local";
};
/**
 * Channel route scope. Local scope requires haiId.
 */
export type ChannelScope = OpenEnum<typeof ChannelScope>;
/** @internal */
export declare const ChannelScope$inboundSchema: z.ZodMiniType<ChannelScope, unknown>;
/** @internal */
export declare const ChannelScope$outboundSchema: z.ZodMiniType<string, ChannelScope>;
//# sourceMappingURL=channel-scope.d.ts.map
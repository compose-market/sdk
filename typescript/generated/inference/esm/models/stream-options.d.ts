import * as z from "zod/v4-mini";
export type StreamOptions = {
    includeUsage?: boolean | undefined;
    includeObfuscation?: boolean | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export type StreamOptions$Outbound = {
    include_usage?: boolean | undefined;
    include_obfuscation?: boolean | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const StreamOptions$outboundSchema: z.ZodMiniType<StreamOptions$Outbound, StreamOptions>;
export declare function streamOptionsToJSON(streamOptions: StreamOptions): string;
//# sourceMappingURL=stream-options.d.ts.map
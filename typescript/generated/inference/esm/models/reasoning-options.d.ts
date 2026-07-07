import * as z from "zod/v4-mini";
export type ReasoningOptions = {
    effort?: string | undefined;
    summary?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export type ReasoningOptions$Outbound = {
    effort?: string | undefined;
    summary?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ReasoningOptions$outboundSchema: z.ZodMiniType<ReasoningOptions$Outbound, ReasoningOptions>;
export declare function reasoningOptionsToJSON(reasoningOptions: ReasoningOptions): string;
//# sourceMappingURL=reasoning-options.d.ts.map
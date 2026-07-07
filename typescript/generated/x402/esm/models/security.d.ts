import * as z from "zod/v4-mini";
export type Security = {
    keyAuth?: string | undefined;
};
/** @internal */
export type Security$Outbound = {
    KeyAuth?: string | undefined;
};
/** @internal */
export declare const Security$outboundSchema: z.ZodMiniType<Security$Outbound, Security>;
export declare function securityToJSON(security: Security): string;
//# sourceMappingURL=security.d.ts.map
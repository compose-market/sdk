import * as z from "zod/v4-mini";
export type PatternsGetRequest = {
    patternId: string;
    agentWallet?: string | undefined;
};
/** @internal */
export type PatternsGetRequest$Outbound = {
    patternId: string;
    agentWallet?: string | undefined;
};
/** @internal */
export declare const PatternsGetRequest$outboundSchema: z.ZodMiniType<PatternsGetRequest$Outbound, PatternsGetRequest>;
export declare function patternsGetRequestToJSON(patternsGetRequest: PatternsGetRequest): string;
//# sourceMappingURL=patterns-get.d.ts.map
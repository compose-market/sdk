import * as z from "zod/v4-mini";
export type PatternsValidateRequest = {
    patternId: string;
};
/** @internal */
export type PatternsValidateRequest$Outbound = {
    patternId: string;
};
/** @internal */
export declare const PatternsValidateRequest$outboundSchema: z.ZodMiniType<PatternsValidateRequest$Outbound, PatternsValidateRequest>;
export declare function patternsValidateRequestToJSON(patternsValidateRequest: PatternsValidateRequest): string;
//# sourceMappingURL=patterns-validate.d.ts.map
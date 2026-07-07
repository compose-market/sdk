import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type PatternsPromoteRequest = {
    patternId: string;
    body: models.MemoryPatternPromoteRequest;
};
/** @internal */
export type PatternsPromoteRequest$Outbound = {
    patternId: string;
    body: models.MemoryPatternPromoteRequest$Outbound;
};
/** @internal */
export declare const PatternsPromoteRequest$outboundSchema: z.ZodMiniType<PatternsPromoteRequest$Outbound, PatternsPromoteRequest>;
export declare function patternsPromoteRequestToJSON(patternsPromoteRequest: PatternsPromoteRequest): string;
//# sourceMappingURL=patterns-promote.d.ts.map
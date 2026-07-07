import * as z from "zod/v4-mini";
export type LoopsGetRequest = {
    loopId: string;
};
/** @internal */
export type LoopsGetRequest$Outbound = {
    loopId: string;
};
/** @internal */
export declare const LoopsGetRequest$outboundSchema: z.ZodMiniType<LoopsGetRequest$Outbound, LoopsGetRequest>;
export declare function loopsGetRequestToJSON(loopsGetRequest: LoopsGetRequest): string;
//# sourceMappingURL=loops-get.d.ts.map
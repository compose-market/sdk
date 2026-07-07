import * as z from "zod/v4-mini";
export type RerankRequest = {
    query: string;
    documents: Array<{
        [k: string]: any;
    }>;
    topK?: number | undefined;
};
/** @internal */
export type RerankRequest$Outbound = {
    query: string;
    documents: Array<{
        [k: string]: any;
    }>;
    topK?: number | undefined;
};
/** @internal */
export declare const RerankRequest$outboundSchema: z.ZodMiniType<RerankRequest$Outbound, RerankRequest>;
export declare function rerankRequestToJSON(rerankRequest: RerankRequest): string;
//# sourceMappingURL=rerank.d.ts.map
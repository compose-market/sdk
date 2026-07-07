import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const VectorSearchRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type VectorSearchRequestScope = ClosedEnum<typeof VectorSearchRequestScope>;
export type VectorSearchRequest = {
    query: string;
    queryEmbedding?: Array<number> | undefined;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: VectorSearchRequestScope | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    limit?: number | undefined;
    threshold?: number | undefined;
};
/** @internal */
export declare const VectorSearchRequestScope$outboundSchema: z.ZodMiniEnum<typeof VectorSearchRequestScope>;
/** @internal */
export type VectorSearchRequest$Outbound = {
    query: string;
    queryEmbedding?: Array<number> | undefined;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    limit?: number | undefined;
    threshold?: number | undefined;
};
/** @internal */
export declare const VectorSearchRequest$outboundSchema: z.ZodMiniType<VectorSearchRequest$Outbound, VectorSearchRequest>;
export declare function vectorSearchRequestToJSON(vectorSearchRequest: VectorSearchRequest): string;
//# sourceMappingURL=vector-search-request.d.ts.map
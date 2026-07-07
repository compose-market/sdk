import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const VectorIndexRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type VectorIndexRequestScope = ClosedEnum<typeof VectorIndexRequestScope>;
export declare const SourceRequestBody: {
    readonly Session: "session";
    readonly Knowledge: "knowledge";
    readonly Pattern: "pattern";
    readonly Archive: "archive";
    readonly Fact: "fact";
};
export type SourceRequestBody = ClosedEnum<typeof SourceRequestBody>;
export type VectorIndexRequest = {
    content: string;
    embedding?: Array<number> | undefined;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: VectorIndexRequestScope | undefined;
    haiId?: string | undefined;
    source: SourceRequestBody;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const VectorIndexRequestScope$outboundSchema: z.ZodMiniEnum<typeof VectorIndexRequestScope>;
/** @internal */
export declare const SourceRequestBody$outboundSchema: z.ZodMiniEnum<typeof SourceRequestBody>;
/** @internal */
export type VectorIndexRequest$Outbound = {
    content: string;
    embedding?: Array<number> | undefined;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    source: string;
    metadata?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const VectorIndexRequest$outboundSchema: z.ZodMiniType<VectorIndexRequest$Outbound, VectorIndexRequest>;
export declare function vectorIndexRequestToJSON(vectorIndexRequest: VectorIndexRequest): string;
//# sourceMappingURL=vector-index-request.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type IndexRequestBody = {
    agentWallet: string;
    documents: Array<{
        [k: string]: any;
    }>;
};
export type IndexRequest = {
    xSessionUserAddress?: string | undefined;
    xSessionActive?: models.SessionActiveHeader | undefined;
    body: IndexRequestBody;
};
/** @internal */
export type IndexRequestBody$Outbound = {
    agentWallet: string;
    documents: Array<{
        [k: string]: any;
    }>;
};
/** @internal */
export declare const IndexRequestBody$outboundSchema: z.ZodMiniType<IndexRequestBody$Outbound, IndexRequestBody>;
export declare function indexRequestBodyToJSON(indexRequestBody: IndexRequestBody): string;
/** @internal */
export type IndexRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-session-active"?: string | undefined;
    body: IndexRequestBody$Outbound;
};
/** @internal */
export declare const IndexRequest$outboundSchema: z.ZodMiniType<IndexRequest$Outbound, IndexRequest>;
export declare function indexRequestToJSON(indexRequest: IndexRequest): string;
//# sourceMappingURL=indext.d.ts.map
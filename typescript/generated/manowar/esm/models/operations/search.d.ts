import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
export type SearchRequestBody = {
    agentWallet: string;
    query: string;
    limit?: number | undefined;
};
export type SearchRequest = {
    xSessionUserAddress?: string | undefined;
    xSessionActive?: models.SessionActiveHeader | undefined;
    body: SearchRequestBody;
};
/**
 * Workspace search result.
 */
export type SearchResponse = {
    results: Array<{
        [k: string]: any;
    }>;
};
/** @internal */
export type SearchRequestBody$Outbound = {
    agentWallet: string;
    query: string;
    limit?: number | undefined;
};
/** @internal */
export declare const SearchRequestBody$outboundSchema: z.ZodMiniType<SearchRequestBody$Outbound, SearchRequestBody>;
export declare function searchRequestBodyToJSON(searchRequestBody: SearchRequestBody): string;
/** @internal */
export type SearchRequest$Outbound = {
    "x-session-user-address"?: string | undefined;
    "x-session-active"?: string | undefined;
    body: SearchRequestBody$Outbound;
};
/** @internal */
export declare const SearchRequest$outboundSchema: z.ZodMiniType<SearchRequest$Outbound, SearchRequest>;
export declare function searchRequestToJSON(searchRequest: SearchRequest): string;
/** @internal */
export declare const SearchResponse$inboundSchema: z.ZodMiniType<SearchResponse, unknown>;
export declare function searchResponseFromJSON(jsonString: string): SafeParseResult<SearchResponse, SDKValidationError>;
//# sourceMappingURL=search.d.ts.map
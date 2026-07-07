import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const SearchResultSource: {
    readonly Session: "session";
    readonly Knowledge: "knowledge";
    readonly Pattern: "pattern";
    readonly Archive: "archive";
    readonly Fact: "fact";
};
export type SearchResultSource = OpenEnum<typeof SearchResultSource>;
export declare const SearchResultScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type SearchResultScope = OpenEnum<typeof SearchResultScope>;
export type SearchResult = {
    id: string;
    vectorId?: string | undefined;
    content: string;
    score: number;
    source: SearchResultSource;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: SearchResultScope | undefined;
    haiId?: string | undefined;
    decayScore: number;
    accessCount: number;
    createdAt: number;
};
/** @internal */
export declare const SearchResultSource$inboundSchema: z.ZodMiniType<SearchResultSource, unknown>;
/** @internal */
export declare const SearchResultScope$inboundSchema: z.ZodMiniType<SearchResultScope, unknown>;
/** @internal */
export declare const SearchResult$inboundSchema: z.ZodMiniType<SearchResult, unknown>;
export declare function searchResultFromJSON(jsonString: string): SafeParseResult<SearchResult, SDKValidationError>;
//# sourceMappingURL=search-result.d.ts.map
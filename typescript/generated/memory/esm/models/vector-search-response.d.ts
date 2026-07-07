import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { SearchResult } from "./search-result.js";
export type VectorSearchResponse = {
    results: Array<SearchResult>;
};
/** @internal */
export declare const VectorSearchResponse$inboundSchema: z.ZodMiniType<VectorSearchResponse, unknown>;
export declare function vectorSearchResponseFromJSON(jsonString: string): SafeParseResult<VectorSearchResponse, SDKValidationError>;
//# sourceMappingURL=vector-search-response.d.ts.map
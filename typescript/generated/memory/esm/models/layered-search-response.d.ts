import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type LayeredSearchResponse = {
    query: string;
    layers: {
        [k: string]: Array<any>;
    };
    totals: {
        [k: string]: number;
    };
};
/** @internal */
export declare const LayeredSearchResponse$inboundSchema: z.ZodMiniType<LayeredSearchResponse, unknown>;
export declare function layeredSearchResponseFromJSON(jsonString: string): SafeParseResult<LayeredSearchResponse, SDKValidationError>;
//# sourceMappingURL=layered-search-response.d.ts.map
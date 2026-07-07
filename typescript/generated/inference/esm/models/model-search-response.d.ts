import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { Model } from "./model.js";
export type ModelSearchResponse = {
    object: "list";
    data: Array<Model>;
    total: number;
    nextCursor: string | null;
};
/** @internal */
export declare const ModelSearchResponse$inboundSchema: z.ZodMiniType<ModelSearchResponse, unknown>;
export declare function modelSearchResponseFromJSON(jsonString: string): SafeParseResult<ModelSearchResponse, SDKValidationError>;
//# sourceMappingURL=model-search-response.d.ts.map
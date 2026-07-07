import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { Model } from "./model.js";
export type ModelListResponse = {
    object: "list";
    data: Array<Model>;
};
/** @internal */
export declare const ModelListResponse$inboundSchema: z.ZodMiniType<ModelListResponse, unknown>;
export declare function modelListResponseFromJSON(jsonString: string): SafeParseResult<ModelListResponse, SDKValidationError>;
//# sourceMappingURL=model-list-response.d.ts.map
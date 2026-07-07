import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type VectorIndexResponse = {
    success: boolean;
    vectorId?: string | undefined;
};
/** @internal */
export declare const VectorIndexResponse$inboundSchema: z.ZodMiniType<VectorIndexResponse, unknown>;
export declare function vectorIndexResponseFromJSON(jsonString: string): SafeParseResult<VectorIndexResponse, SDKValidationError>;
//# sourceMappingURL=vector-index-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type RerankResponse = {
    results: Array<{
        [k: string]: any;
    }>;
};
/** @internal */
export declare const RerankResponse$inboundSchema: z.ZodMiniType<RerankResponse, unknown>;
export declare function rerankResponseFromJSON(jsonString: string): SafeParseResult<RerankResponse, SDKValidationError>;
//# sourceMappingURL=rerank-response.d.ts.map
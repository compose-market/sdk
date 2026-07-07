import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ModelParamsResponse = {
    modelId: string;
    type?: string | null | undefined;
    provider?: string | null | undefined;
    params: {
        [k: string]: {
            [k: string]: any;
        };
    };
    defaults: {
        [k: string]: any;
    };
};
/** @internal */
export declare const ModelParamsResponse$inboundSchema: z.ZodMiniType<ModelParamsResponse, unknown>;
export declare function modelParamsResponseFromJSON(jsonString: string): SafeParseResult<ModelParamsResponse, SDKValidationError>;
//# sourceMappingURL=model-params-response.d.ts.map
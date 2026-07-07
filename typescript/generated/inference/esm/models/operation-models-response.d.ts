import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { OperationModel } from "./operation-model.js";
export type OperationModelsResponse = {
    object: "list";
    data: Array<OperationModel>;
    total: number;
    nextCursor: string | null;
};
/** @internal */
export declare const OperationModelsResponse$inboundSchema: z.ZodMiniType<OperationModelsResponse, unknown>;
export declare function operationModelsResponseFromJSON(jsonString: string): SafeParseResult<OperationModelsResponse, SDKValidationError>;
//# sourceMappingURL=operation-models-response.d.ts.map
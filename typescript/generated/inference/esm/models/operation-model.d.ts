import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ModelOperationCapability } from "./model-operation-capability.js";
import { ModelProvider } from "./model-provider.js";
export type OperationModelType = string | Array<string>;
export type OperationModelCreatedAt = string | number;
export type OperationModel = {
    modelId: string;
    upstreamModelId?: string | undefined;
    name?: string | null | undefined;
    provider: ModelProvider;
    family?: string | undefined;
    type?: string | Array<string> | null | undefined;
    description?: string | null | undefined;
    input?: any | undefined;
    output?: any | undefined;
    contextWindow?: any | undefined;
    pricing?: any | undefined;
    maxOutputTokens?: number | undefined;
    capabilities?: any | undefined;
    modelType?: any | undefined;
    sourceMetadata?: any | undefined;
    params?: any | undefined;
    operations: Array<ModelOperationCapability>;
    ownedBy?: string | undefined;
    createdAt?: string | number | undefined;
    available?: boolean | undefined;
    availableFrom?: Array<string> | undefined;
    hfInferenceProvider?: string | undefined;
    hfProviderId?: string | undefined;
};
/** @internal */
export declare const OperationModelType$inboundSchema: z.ZodMiniType<OperationModelType, unknown>;
export declare function operationModelTypeFromJSON(jsonString: string): SafeParseResult<OperationModelType, SDKValidationError>;
/** @internal */
export declare const OperationModelCreatedAt$inboundSchema: z.ZodMiniType<OperationModelCreatedAt, unknown>;
export declare function operationModelCreatedAtFromJSON(jsonString: string): SafeParseResult<OperationModelCreatedAt, SDKValidationError>;
/** @internal */
export declare const OperationModel$inboundSchema: z.ZodMiniType<OperationModel, unknown>;
export declare function operationModelFromJSON(jsonString: string): SafeParseResult<OperationModel, SDKValidationError>;
//# sourceMappingURL=operation-model.d.ts.map
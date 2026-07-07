import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ModelOperationCapability } from "./model-operation-capability.js";
import { ModelProvider } from "./model-provider.js";
export type ModelType = string | Array<string>;
export type ModelCreatedAt = string | number;
export type Model = {
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
    operations?: Array<ModelOperationCapability> | undefined;
    ownedBy?: string | undefined;
    createdAt?: string | number | undefined;
    available?: boolean | undefined;
    availableFrom?: Array<string> | undefined;
    hfInferenceProvider?: string | undefined;
    hfProviderId?: string | undefined;
};
/** @internal */
export declare const ModelType$inboundSchema: z.ZodMiniType<ModelType, unknown>;
export declare function modelTypeFromJSON(jsonString: string): SafeParseResult<ModelType, SDKValidationError>;
/** @internal */
export declare const ModelCreatedAt$inboundSchema: z.ZodMiniType<ModelCreatedAt, unknown>;
export declare function modelCreatedAtFromJSON(jsonString: string): SafeParseResult<ModelCreatedAt, SDKValidationError>;
/** @internal */
export declare const Model$inboundSchema: z.ZodMiniType<Model, unknown>;
export declare function modelFromJSON(jsonString: string): SafeParseResult<Model, SDKValidationError>;
//# sourceMappingURL=model.d.ts.map
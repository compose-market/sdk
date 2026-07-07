import * as z from "zod/v4-mini";
import { CanonicalModality } from "./canonical-modality.js";
import { ModelProvider } from "./model-provider.js";
export type ModelSearchRequest = {
    q?: string | undefined;
    modality?: CanonicalModality | undefined;
    operation?: string | undefined;
    provider?: ModelProvider | undefined;
    priceMaxPerMTok?: number | undefined;
    contextWindowMin?: number | undefined;
    streaming?: boolean | undefined;
    cursor?: string | null | undefined;
    limit?: number | undefined;
};
/** @internal */
export type ModelSearchRequest$Outbound = {
    q?: string | undefined;
    modality?: string | undefined;
    operation?: string | undefined;
    provider?: string | undefined;
    priceMaxPerMTok?: number | undefined;
    contextWindowMin?: number | undefined;
    streaming?: boolean | undefined;
    cursor?: string | null | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const ModelSearchRequest$outboundSchema: z.ZodMiniType<ModelSearchRequest$Outbound, ModelSearchRequest>;
export declare function modelSearchRequestToJSON(modelSearchRequest: ModelSearchRequest): string;
//# sourceMappingURL=model-search-request.d.ts.map
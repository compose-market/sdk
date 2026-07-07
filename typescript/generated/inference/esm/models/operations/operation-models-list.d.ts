import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type OperationModelsListRequest = {
    modality: models.CanonicalModality;
    operation: string;
    q?: string | undefined;
    provider?: models.ModelProvider | undefined;
    streaming?: boolean | undefined;
    cursor?: string | null | undefined;
    limit?: number | undefined;
};
/** @internal */
export type OperationModelsListRequest$Outbound = {
    modality: string;
    operation: string;
    q?: string | undefined;
    provider?: string | undefined;
    streaming?: boolean | undefined;
    cursor?: string | null | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const OperationModelsListRequest$outboundSchema: z.ZodMiniType<OperationModelsListRequest$Outbound, OperationModelsListRequest>;
export declare function operationModelsListRequestToJSON(operationModelsListRequest: OperationModelsListRequest): string;
//# sourceMappingURL=operation-models-list.d.ts.map
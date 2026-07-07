import * as z from "zod/v4-mini";
export type ModelMeterRequest = {
    modelId: string;
    modality: string;
    usage?: {
        [k: string]: any;
    } | undefined;
    media?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export type ModelMeterRequest$Outbound = {
    modelId: string;
    modality: string;
    usage?: {
        [k: string]: any;
    } | undefined;
    media?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const ModelMeterRequest$outboundSchema: z.ZodMiniType<ModelMeterRequest$Outbound, ModelMeterRequest>;
export declare function modelMeterRequestToJSON(modelMeterRequest: ModelMeterRequest): string;
//# sourceMappingURL=model-meter-request.d.ts.map
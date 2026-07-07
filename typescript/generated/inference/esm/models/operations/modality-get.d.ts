import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ModalityGetRequest = {
    modality: models.CanonicalModality;
};
/** @internal */
export type ModalityGetRequest$Outbound = {
    modality: string;
};
/** @internal */
export declare const ModalityGetRequest$outboundSchema: z.ZodMiniType<ModalityGetRequest$Outbound, ModalityGetRequest>;
export declare function modalityGetRequestToJSON(modalityGetRequest: ModalityGetRequest): string;
//# sourceMappingURL=modality-get.d.ts.map
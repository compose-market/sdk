import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type OperationsListRequest = {
    modality: models.CanonicalModality;
};
/** @internal */
export type OperationsListRequest$Outbound = {
    modality: string;
};
/** @internal */
export declare const OperationsListRequest$outboundSchema: z.ZodMiniType<OperationsListRequest$Outbound, OperationsListRequest>;
export declare function operationsListRequestToJSON(operationsListRequest: OperationsListRequest): string;
//# sourceMappingURL=operations-list.d.ts.map
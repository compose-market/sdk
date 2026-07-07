import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ListRequest = {
    provider?: models.ModelProvider | undefined;
    modality?: models.CanonicalModality | undefined;
    limit?: number | undefined;
};
/** @internal */
export type ListRequest$Outbound = {
    provider?: string | undefined;
    modality?: string | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const ListRequest$outboundSchema: z.ZodMiniType<ListRequest$Outbound, ListRequest>;
export declare function listRequestToJSON(listRequest: ListRequest): string;
//# sourceMappingURL=list.d.ts.map
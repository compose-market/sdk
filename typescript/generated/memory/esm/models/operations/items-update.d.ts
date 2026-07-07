import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ItemsUpdateRequest = {
    id: string;
    body: models.MemoryItemUpdateRequest;
};
/** @internal */
export type ItemsUpdateRequest$Outbound = {
    id: string;
    body: models.MemoryItemUpdateRequest$Outbound;
};
/** @internal */
export declare const ItemsUpdateRequest$outboundSchema: z.ZodMiniType<ItemsUpdateRequest$Outbound, ItemsUpdateRequest>;
export declare function itemsUpdateRequestToJSON(itemsUpdateRequest: ItemsUpdateRequest): string;
//# sourceMappingURL=items-update.d.ts.map
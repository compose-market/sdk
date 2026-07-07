import * as z from "zod/v4-mini";
export type ItemsDeleteRequest = {
    id: string;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
    hardDelete?: boolean | undefined;
};
/** @internal */
export type ItemsDeleteRequest$Outbound = {
    id: string;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
    hardDelete?: boolean | undefined;
};
/** @internal */
export declare const ItemsDeleteRequest$outboundSchema: z.ZodMiniType<ItemsDeleteRequest$Outbound, ItemsDeleteRequest>;
export declare function itemsDeleteRequestToJSON(itemsDeleteRequest: ItemsDeleteRequest): string;
//# sourceMappingURL=items-delete.d.ts.map
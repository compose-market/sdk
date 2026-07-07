import * as z from "zod/v4-mini";
export type ItemsGetRequest = {
    id: string;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
};
/** @internal */
export type ItemsGetRequest$Outbound = {
    id: string;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
};
/** @internal */
export declare const ItemsGetRequest$outboundSchema: z.ZodMiniType<ItemsGetRequest$Outbound, ItemsGetRequest>;
export declare function itemsGetRequestToJSON(itemsGetRequest: ItemsGetRequest): string;
//# sourceMappingURL=items-get.d.ts.map
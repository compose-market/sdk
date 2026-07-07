import * as z from "zod/v4-mini";
export type ListRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    limit?: number | undefined;
};
/** @internal */
export type ListRequest$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const ListRequest$outboundSchema: z.ZodMiniType<ListRequest$Outbound, ListRequest>;
export declare function listRequestToJSON(listRequest: ListRequest): string;
//# sourceMappingURL=list.d.ts.map
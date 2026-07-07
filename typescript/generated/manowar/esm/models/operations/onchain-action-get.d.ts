import * as z from "zod/v4-mini";
/**
 * Production connectors Worker onchain action metadata.
 */
export declare const OnchainActionGetServerConnectors = "connectors";
export declare const OnchainActionGetServerList: {
    connectors: string;
};
export type OnchainActionGetRequest = {
    connectorId: string;
    command: string;
};
/** @internal */
export type OnchainActionGetRequest$Outbound = {
    connectorId: string;
    command: string;
};
/** @internal */
export declare const OnchainActionGetRequest$outboundSchema: z.ZodMiniType<OnchainActionGetRequest$Outbound, OnchainActionGetRequest>;
export declare function onchainActionGetRequestToJSON(onchainActionGetRequest: OnchainActionGetRequest): string;
//# sourceMappingURL=onchain-action-get.d.ts.map
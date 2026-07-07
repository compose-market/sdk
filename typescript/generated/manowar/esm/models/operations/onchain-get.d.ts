import * as z from "zod/v4-mini";
/**
 * Production connectors Worker onchain catalog.
 */
export declare const OnchainGetServerConnectors = "connectors";
export declare const OnchainGetServerList: {
    connectors: string;
};
export type OnchainGetRequest = {
    connectorId: string;
};
/** @internal */
export type OnchainGetRequest$Outbound = {
    connectorId: string;
};
/** @internal */
export declare const OnchainGetRequest$outboundSchema: z.ZodMiniType<OnchainGetRequest$Outbound, OnchainGetRequest>;
export declare function onchainGetRequestToJSON(onchainGetRequest: OnchainGetRequest): string;
//# sourceMappingURL=onchain-get.d.ts.map
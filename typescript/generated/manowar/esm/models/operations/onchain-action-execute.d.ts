import * as z from "zod/v4-mini";
import * as models from "../index.js";
/**
 * Production connectors Worker onchain execution.
 */
export declare const OnchainActionExecuteServerConnectors = "connectors";
export declare const OnchainActionExecuteServerList: {
    connectors: string;
};
export type OnchainActionExecuteRequest = {
    connectorId: string;
    command: string;
    body: models.ActionExecuteRequest;
};
/** @internal */
export type OnchainActionExecuteRequest$Outbound = {
    connectorId: string;
    command: string;
    body: models.ActionExecuteRequest$Outbound;
};
/** @internal */
export declare const OnchainActionExecuteRequest$outboundSchema: z.ZodMiniType<OnchainActionExecuteRequest$Outbound, OnchainActionExecuteRequest>;
export declare function onchainActionExecuteRequestToJSON(onchainActionExecuteRequest: OnchainActionExecuteRequest): string;
//# sourceMappingURL=onchain-action-execute.d.ts.map
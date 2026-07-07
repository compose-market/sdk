import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
export type ListRequest = {
    xSessionUserAddress: string;
    xChainId: number;
};
/**
 * Keys owned by the wallet.
 */
export type ListResponse = {
    keys: Array<models.KeyRecord>;
};
/** @internal */
export type ListRequest$Outbound = {
    "x-session-user-address": string;
    "x-chain-id": number;
};
/** @internal */
export declare const ListRequest$outboundSchema: z.ZodMiniType<ListRequest$Outbound, ListRequest>;
export declare function listRequestToJSON(listRequest: ListRequest): string;
/** @internal */
export declare const ListResponse$inboundSchema: z.ZodMiniType<ListResponse, unknown>;
export declare function listResponseFromJSON(jsonString: string): SafeParseResult<ListResponse, SDKValidationError>;
//# sourceMappingURL=list.d.ts.map
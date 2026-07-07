import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type CreateRequest = {
    xSessionUserAddress: string;
    xChainId: number;
    body: models.KeyCreateRequest;
};
/** @internal */
export type CreateRequest$Outbound = {
    "x-session-user-address": string;
    "x-chain-id": number;
    body: models.KeyCreateRequest$Outbound;
};
/** @internal */
export declare const CreateRequest$outboundSchema: z.ZodMiniType<CreateRequest$Outbound, CreateRequest>;
export declare function createRequestToJSON(createRequest: CreateRequest): string;
//# sourceMappingURL=create.d.ts.map
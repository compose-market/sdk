import * as z from "zod/v4-mini";
export type GetRequest = {
    keyId: string;
};
/** @internal */
export type GetRequest$Outbound = {
    keyId: string;
};
/** @internal */
export declare const GetRequest$outboundSchema: z.ZodMiniType<GetRequest$Outbound, GetRequest>;
export declare function getRequestToJSON(getRequest: GetRequest): string;
//# sourceMappingURL=get.d.ts.map
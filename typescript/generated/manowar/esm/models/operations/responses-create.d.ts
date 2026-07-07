import * as z from "zod/v4-mini";
/**
 * Production API gateway for public agent execution.
 */
export declare const ResponsesCreateServerComposeApi = "compose-api";
export declare const ResponsesCreateServerList: {
    "compose-api": string;
};
export type ResponsesCreateRequest = {
    walletAddress: string;
    body: {
        [k: string]: any;
    };
};
/** @internal */
export type ResponsesCreateRequest$Outbound = {
    walletAddress: string;
    body: {
        [k: string]: any;
    };
};
/** @internal */
export declare const ResponsesCreateRequest$outboundSchema: z.ZodMiniType<ResponsesCreateRequest$Outbound, ResponsesCreateRequest>;
export declare function responsesCreateRequestToJSON(responsesCreateRequest: ResponsesCreateRequest): string;
//# sourceMappingURL=responses-create.d.ts.map
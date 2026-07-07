import * as z from "zod/v4-mini";
export type ResponsesGetRequest = {
    responseId: string;
};
/** @internal */
export type ResponsesGetRequest$Outbound = {
    responseId: string;
};
/** @internal */
export declare const ResponsesGetRequest$outboundSchema: z.ZodMiniType<ResponsesGetRequest$Outbound, ResponsesGetRequest>;
export declare function responsesGetRequestToJSON(responsesGetRequest: ResponsesGetRequest): string;
//# sourceMappingURL=responses-get.d.ts.map
import * as z from "zod/v4-mini";
export type ResponsesCancelRequest = {
    responseId: string;
};
/** @internal */
export type ResponsesCancelRequest$Outbound = {
    responseId: string;
};
/** @internal */
export declare const ResponsesCancelRequest$outboundSchema: z.ZodMiniType<ResponsesCancelRequest$Outbound, ResponsesCancelRequest>;
export declare function responsesCancelRequestToJSON(responsesCancelRequest: ResponsesCancelRequest): string;
//# sourceMappingURL=responses-cancel.d.ts.map
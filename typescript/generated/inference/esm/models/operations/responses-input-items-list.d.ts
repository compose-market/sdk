import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
export type ResponsesInputItemsListRequest = {
    responseId: string;
};
/**
 * Stored input items.
 */
export type ResponsesInputItemsListResponse = {
    object: "list";
    data: Array<{
        [k: string]: any;
    }>;
};
/** @internal */
export type ResponsesInputItemsListRequest$Outbound = {
    responseId: string;
};
/** @internal */
export declare const ResponsesInputItemsListRequest$outboundSchema: z.ZodMiniType<ResponsesInputItemsListRequest$Outbound, ResponsesInputItemsListRequest>;
export declare function responsesInputItemsListRequestToJSON(responsesInputItemsListRequest: ResponsesInputItemsListRequest): string;
/** @internal */
export declare const ResponsesInputItemsListResponse$inboundSchema: z.ZodMiniType<ResponsesInputItemsListResponse, unknown>;
export declare function responsesInputItemsListResponseFromJSON(jsonString: string): SafeParseResult<ResponsesInputItemsListResponse, SDKValidationError>;
//# sourceMappingURL=responses-input-items-list.d.ts.map
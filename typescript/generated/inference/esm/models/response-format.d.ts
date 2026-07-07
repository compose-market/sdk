import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const ResponseFormatType: {
    readonly Text: "text";
    readonly JsonObject: "json_object";
    readonly JsonSchema: "json_schema";
};
export type ResponseFormatType = ClosedEnum<typeof ResponseFormatType>;
export type ResponseFormat = {
    type?: ResponseFormatType | undefined;
    jsonSchema?: {
        [k: string]: any;
    } | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ResponseFormatType$outboundSchema: z.ZodMiniEnum<typeof ResponseFormatType>;
/** @internal */
export type ResponseFormat$Outbound = {
    type?: string | undefined;
    json_schema?: {
        [k: string]: any;
    } | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ResponseFormat$outboundSchema: z.ZodMiniType<ResponseFormat$Outbound, ResponseFormat>;
export declare function responseFormatToJSON(responseFormat: ResponseFormat): string;
//# sourceMappingURL=response-format.d.ts.map
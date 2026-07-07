import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
/**
 * Advisory attachment kind. Agents and workflows pass attachments through without model-capability gating.
 */
export declare const Type: {
    readonly Image: "image";
    readonly Audio: "audio";
    readonly Video: "video";
    readonly Pdf: "pdf";
    readonly File: "file";
    readonly Text: "text";
    readonly Json: "json";
    readonly Url: "url";
};
/**
 * Advisory attachment kind. Agents and workflows pass attachments through without model-capability gating.
 */
export type Type = ClosedEnum<typeof Type>;
export declare const Detail: {
    readonly Auto: "auto";
    readonly Low: "low";
    readonly High: "high";
};
export type Detail = ClosedEnum<typeof Detail>;
export type Attachment = {
    /**
     * Advisory attachment kind. Agents and workflows pass attachments through without model-capability gating.
     */
    type?: Type | undefined;
    url?: string | undefined;
    uri?: string | undefined;
    data?: string | undefined;
    base64?: string | undefined;
    mimeType?: string | undefined;
    contentType?: string | undefined;
    name?: string | undefined;
    filename?: string | undefined;
    text?: string | undefined;
    content?: string | undefined;
    detail?: Detail | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const Type$outboundSchema: z.ZodMiniEnum<typeof Type>;
/** @internal */
export declare const Detail$outboundSchema: z.ZodMiniEnum<typeof Detail>;
/** @internal */
export type Attachment$Outbound = {
    type?: string | undefined;
    url?: string | undefined;
    uri?: string | undefined;
    data?: string | undefined;
    base64?: string | undefined;
    mimeType?: string | undefined;
    contentType?: string | undefined;
    name?: string | undefined;
    filename?: string | undefined;
    text?: string | undefined;
    content?: string | undefined;
    detail?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const Attachment$outboundSchema: z.ZodMiniType<Attachment$Outbound, Attachment>;
export declare function attachmentToJSON(attachment: Attachment): string;
//# sourceMappingURL=attachment.d.ts.map
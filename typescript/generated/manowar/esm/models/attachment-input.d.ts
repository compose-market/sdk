import * as z from "zod/v4-mini";
import { Attachment, Attachment$Outbound } from "./attachment.js";
export type AttachmentInput = Attachment | string;
/** @internal */
export type AttachmentInput$Outbound = Attachment$Outbound | string;
/** @internal */
export declare const AttachmentInput$outboundSchema: z.ZodMiniType<AttachmentInput$Outbound, AttachmentInput>;
export declare function attachmentInputToJSON(attachmentInput: AttachmentInput): string;
//# sourceMappingURL=attachment-input.d.ts.map
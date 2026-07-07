import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const CanonicalModality: {
    readonly Text: "text";
    readonly Image: "image";
    readonly Audio: "audio";
    readonly Video: "video";
    readonly Embedding: "embedding";
    readonly Realtime: "realtime";
};
export type CanonicalModality = OpenEnum<typeof CanonicalModality>;
/** @internal */
export declare const CanonicalModality$inboundSchema: z.ZodMiniType<CanonicalModality, unknown>;
/** @internal */
export declare const CanonicalModality$outboundSchema: z.ZodMiniType<string, CanonicalModality>;
//# sourceMappingURL=canonical-modality.d.ts.map
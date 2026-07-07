import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type TranscriptIndexResponse = {
    indexed: boolean;
    messageCount: number;
    vectorCount: number;
};
/** @internal */
export declare const TranscriptIndexResponse$inboundSchema: z.ZodMiniType<TranscriptIndexResponse, unknown>;
export declare function transcriptIndexResponseFromJSON(jsonString: string): SafeParseResult<TranscriptIndexResponse, SDKValidationError>;
//# sourceMappingURL=transcript-index-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type SessionCompressResponse = {
    summary: string;
    entitiesExtracted: number;
};
/** @internal */
export declare const SessionCompressResponse$inboundSchema: z.ZodMiniType<SessionCompressResponse, unknown>;
export declare function sessionCompressResponseFromJSON(jsonString: string): SafeParseResult<SessionCompressResponse, SDKValidationError>;
//# sourceMappingURL=session-compress-response.d.ts.map
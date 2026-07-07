import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { ErrorEnvelope } from "./error-envelope.js";
import { LegacyError } from "./legacy-error.js";
import { SDKValidationError } from "./sdk-validation-error.js";
/**
 * Compose error response.
 */
export type ErrorResponse = ErrorEnvelope | LegacyError;
/** @internal */
export declare const ErrorResponse$inboundSchema: z.ZodMiniType<ErrorResponse, unknown>;
export declare function errorResponseFromJSON(jsonString: string): SafeParseResult<ErrorResponse, SDKValidationError>;
//# sourceMappingURL=error-response.d.ts.map
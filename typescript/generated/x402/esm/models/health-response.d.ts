import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type HealthResponse = {
    status?: string | undefined;
    timestamp?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const HealthResponse$inboundSchema: z.ZodMiniType<HealthResponse, unknown>;
export declare function healthResponseFromJSON(jsonString: string): SafeParseResult<HealthResponse, SDKValidationError>;
//# sourceMappingURL=health-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ErrorT = string | {
    [k: string]: any;
};
/** @internal */
export declare const ErrorT$inboundSchema: z.ZodMiniType<ErrorT, unknown>;
export declare function errorFromJSON(jsonString: string): SafeParseResult<ErrorT, SDKValidationError>;
//# sourceMappingURL=error-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type Resource = {
    url: string;
    description?: string | undefined;
    mimeType?: string | undefined;
};
/** @internal */
export declare const Resource$inboundSchema: z.ZodMiniType<Resource, unknown>;
export declare function resourceFromJSON(jsonString: string): SafeParseResult<Resource, SDKValidationError>;
//# sourceMappingURL=payment-required-error.d.ts.map
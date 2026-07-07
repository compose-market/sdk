import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type Kind = {
    x402Version: number;
    scheme: string;
    network: string;
    extra?: {
        [k: string]: any;
    } | undefined;
};
export type FacilitatorSupportedResponse = {
    kinds: Array<Kind>;
    extensions: Array<string>;
    signers?: {
        [k: string]: Array<string>;
    } | undefined;
};
/** @internal */
export declare const Kind$inboundSchema: z.ZodMiniType<Kind, unknown>;
export declare function kindFromJSON(jsonString: string): SafeParseResult<Kind, SDKValidationError>;
/** @internal */
export declare const FacilitatorSupportedResponse$inboundSchema: z.ZodMiniType<FacilitatorSupportedResponse, unknown>;
export declare function facilitatorSupportedResponseFromJSON(jsonString: string): SafeParseResult<FacilitatorSupportedResponse, SDKValidationError>;
//# sourceMappingURL=facilitator-supported-response.d.ts.map
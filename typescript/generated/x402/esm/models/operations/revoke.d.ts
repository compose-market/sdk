import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
export type RevokeRequest = {
    keyId: string;
};
/**
 * Revocation result.
 */
export type RevokeResponse = {
    success: boolean;
    keyId: string;
};
/** @internal */
export type RevokeRequest$Outbound = {
    keyId: string;
};
/** @internal */
export declare const RevokeRequest$outboundSchema: z.ZodMiniType<RevokeRequest$Outbound, RevokeRequest>;
export declare function revokeRequestToJSON(revokeRequest: RevokeRequest): string;
/** @internal */
export declare const RevokeResponse$inboundSchema: z.ZodMiniType<RevokeResponse, unknown>;
export declare function revokeResponseFromJSON(jsonString: string): SafeParseResult<RevokeResponse, SDKValidationError>;
//# sourceMappingURL=revoke.d.ts.map
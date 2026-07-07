import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { KeyPurpose } from "./key-purpose.js";
export type KeyCreateResponse = {
    keyId: string;
    token: string;
    purpose: KeyPurpose;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetLimit: string;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetUsed: string;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetRemaining: string;
    createdAt: number;
    expiresAt: number;
    chainId: number;
    name?: string | undefined;
};
/** @internal */
export declare const KeyCreateResponse$inboundSchema: z.ZodMiniType<KeyCreateResponse, unknown>;
export declare function keyCreateResponseFromJSON(jsonString: string): SafeParseResult<KeyCreateResponse, SDKValidationError>;
//# sourceMappingURL=key-create-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { KeyPurpose } from "./key-purpose.js";
export type KeyRecord = {
    keyId: string;
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
    budgetReserved?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetRemaining: string;
    createdAt: number;
    expiresAt: number;
    revokedAt?: number | undefined;
    lastUsedAt?: number | undefined;
    name?: string | undefined;
    chainId?: number | undefined;
};
/** @internal */
export declare const KeyRecord$inboundSchema: z.ZodMiniType<KeyRecord, unknown>;
export declare function keyRecordFromJSON(jsonString: string): SafeParseResult<KeyRecord, SDKValidationError>;
//# sourceMappingURL=key-record.d.ts.map
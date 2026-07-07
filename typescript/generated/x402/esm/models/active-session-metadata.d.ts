import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ActiveSessionMetadata = {
    hasSession: boolean;
    reason?: string | undefined;
    keyId?: string | undefined;
    token?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetLimit?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetUsed?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetLocked?: string | undefined;
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetRemaining?: string | undefined;
    expiresAt?: number | undefined;
    chainId?: number | undefined;
    name?: string | undefined;
    status?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const ActiveSessionMetadata$inboundSchema: z.ZodMiniType<ActiveSessionMetadata, unknown>;
export declare function activeSessionMetadataFromJSON(jsonString: string): SafeParseResult<ActiveSessionMetadata, SDKValidationError>;
//# sourceMappingURL=active-session-metadata.d.ts.map
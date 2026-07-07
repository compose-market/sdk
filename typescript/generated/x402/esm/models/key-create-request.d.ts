import * as z from "zod/v4-mini";
import { KeyPurpose } from "./key-purpose.js";
export type KeyCreateRequest = {
    /**
     * Non-negative integer amount in USDC atomic units.
     */
    budgetLimit: string;
    expiresAt: number;
    purpose: KeyPurpose;
    chainId: number;
    name?: string | undefined;
};
/** @internal */
export type KeyCreateRequest$Outbound = {
    budgetLimit: string;
    expiresAt: number;
    purpose: string;
    chainId: number;
    name?: string | undefined;
};
/** @internal */
export declare const KeyCreateRequest$outboundSchema: z.ZodMiniType<KeyCreateRequest$Outbound, KeyCreateRequest>;
export declare function keyCreateRequestToJSON(keyCreateRequest: KeyCreateRequest): string;
//# sourceMappingURL=key-create-request.d.ts.map
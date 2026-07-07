import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const FacilitatorChainScheme: {
    readonly Exact: "exact";
    readonly Upto: "upto";
};
export type FacilitatorChainScheme = OpenEnum<typeof FacilitatorChainScheme>;
export type FacilitatorChain = {
    chainId: number;
    name: string;
    network: string;
    shortName?: string | undefined;
    isTestnet: boolean;
    explorer?: string | undefined;
    usdcAddress: string;
    x402UptoPermit2Proxy?: string | undefined;
    schemes: Array<FacilitatorChainScheme>;
    asset: "USDC";
    decimals: 6;
};
/** @internal */
export declare const FacilitatorChainScheme$inboundSchema: z.ZodMiniType<FacilitatorChainScheme, unknown>;
/** @internal */
export declare const FacilitatorChain$inboundSchema: z.ZodMiniType<FacilitatorChain, unknown>;
export declare function facilitatorChainFromJSON(jsonString: string): SafeParseResult<FacilitatorChain, SDKValidationError>;
//# sourceMappingURL=facilitator-chain.d.ts.map
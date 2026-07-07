import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { FacilitatorChain } from "./facilitator-chain.js";
export type FacilitatorChainsResponse = {
    chains: Array<FacilitatorChain>;
    defaultChainId: number;
};
/** @internal */
export declare const FacilitatorChainsResponse$inboundSchema: z.ZodMiniType<FacilitatorChainsResponse, unknown>;
export declare function facilitatorChainsResponseFromJSON(jsonString: string): SafeParseResult<FacilitatorChainsResponse, SDKValidationError>;
//# sourceMappingURL=facilitator-chains-response.d.ts.map
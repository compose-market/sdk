import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { CanonicalModality } from "./canonical-modality.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { PricingUnit } from "./pricing-unit.js";
export type ModelOperationCapability = {
    modality: CanonicalModality;
    operation: string;
    sourceTypes: Array<string>;
    input: Array<string>;
    output: Array<string>;
    pricingUnits: Array<PricingUnit>;
    streamable: boolean;
};
/** @internal */
export declare const ModelOperationCapability$inboundSchema: z.ZodMiniType<ModelOperationCapability, unknown>;
export declare function modelOperationCapabilityFromJSON(jsonString: string): SafeParseResult<ModelOperationCapability, SDKValidationError>;
//# sourceMappingURL=model-operation-capability.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { CanonicalModality } from "./canonical-modality.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { OperationCatalogEntry } from "./operation-catalog-entry.js";
import { PricingUnit } from "./pricing-unit.js";
export type ModalityCatalogEntry = {
    modality: CanonicalModality;
    operations: Array<OperationCatalogEntry>;
    modelCount: number;
    pricingUnits: Array<PricingUnit>;
};
/** @internal */
export declare const ModalityCatalogEntry$inboundSchema: z.ZodMiniType<ModalityCatalogEntry, unknown>;
export declare function modalityCatalogEntryFromJSON(jsonString: string): SafeParseResult<ModalityCatalogEntry, SDKValidationError>;
//# sourceMappingURL=modality-catalog-entry.d.ts.map
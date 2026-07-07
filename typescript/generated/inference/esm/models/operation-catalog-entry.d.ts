import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { PricingUnit } from "./pricing-unit.js";
export type OperationCatalogEntry = {
    operation: string;
    modelCount: number;
    sourceTypes: Array<string>;
    pricingUnits: Array<PricingUnit>;
};
/** @internal */
export declare const OperationCatalogEntry$inboundSchema: z.ZodMiniType<OperationCatalogEntry, unknown>;
export declare function operationCatalogEntryFromJSON(jsonString: string): SafeParseResult<OperationCatalogEntry, SDKValidationError>;
//# sourceMappingURL=operation-catalog-entry.d.ts.map
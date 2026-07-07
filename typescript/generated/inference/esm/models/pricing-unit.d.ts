import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type PricingUnit = {
    unitKey: string;
    unit?: string | undefined;
    header?: string | undefined;
    entries: {
        [k: string]: number;
    };
    valueKeys: Array<string>;
    default?: boolean | undefined;
};
/** @internal */
export declare const PricingUnit$inboundSchema: z.ZodMiniType<PricingUnit, unknown>;
export declare function pricingUnitFromJSON(jsonString: string): SafeParseResult<PricingUnit, SDKValidationError>;
//# sourceMappingURL=pricing-unit.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ModalityCatalogEntry } from "./modality-catalog-entry.js";
export type ModalityListResponse = {
    object: "list";
    data: Array<ModalityCatalogEntry>;
};
/** @internal */
export declare const ModalityListResponse$inboundSchema: z.ZodMiniType<ModalityListResponse, unknown>;
export declare function modalityListResponseFromJSON(jsonString: string): SafeParseResult<ModalityListResponse, SDKValidationError>;
//# sourceMappingURL=modality-list-response.d.ts.map
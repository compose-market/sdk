import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { OperationCatalogEntry } from "./operation-catalog-entry.js";
export type OperationListResponse = {
    object: "list";
    data: Array<OperationCatalogEntry>;
};
/** @internal */
export declare const OperationListResponse$inboundSchema: z.ZodMiniType<OperationListResponse, unknown>;
export declare function operationListResponseFromJSON(jsonString: string): SafeParseResult<OperationListResponse, SDKValidationError>;
//# sourceMappingURL=operation-list-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryItemDeleteResponse = {
    deleted: boolean;
    hardDeleted: boolean;
};
/** @internal */
export declare const MemoryItemDeleteResponse$inboundSchema: z.ZodMiniType<MemoryItemDeleteResponse, unknown>;
export declare function memoryItemDeleteResponseFromJSON(jsonString: string): SafeParseResult<MemoryItemDeleteResponse, SDKValidationError>;
//# sourceMappingURL=memory-item-delete-response.d.ts.map
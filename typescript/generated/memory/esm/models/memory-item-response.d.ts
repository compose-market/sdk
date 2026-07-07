import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryVectorItem } from "./memory-vector-item.js";
export type MemoryItemResponse = {
    item: MemoryVectorItem;
};
/** @internal */
export declare const MemoryItemResponse$inboundSchema: z.ZodMiniType<MemoryItemResponse, unknown>;
export declare function memoryItemResponseFromJSON(jsonString: string): SafeParseResult<MemoryItemResponse, SDKValidationError>;
//# sourceMappingURL=memory-item-response.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryVectorItem } from "./memory-vector-item.js";
export type MemoryItemUpdateResponse = {
    updated: boolean;
    item?: MemoryVectorItem | undefined;
};
/** @internal */
export declare const MemoryItemUpdateResponse$inboundSchema: z.ZodMiniType<MemoryItemUpdateResponse, unknown>;
export declare function memoryItemUpdateResponseFromJSON(jsonString: string): SafeParseResult<MemoryItemUpdateResponse, SDKValidationError>;
//# sourceMappingURL=memory-item-update-response.d.ts.map
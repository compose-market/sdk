import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const MemoryRememberedItemStatus: {
    readonly Active: "active";
};
export type MemoryRememberedItemStatus = ClosedEnum<typeof MemoryRememberedItemStatus>;
export type MemoryRememberedItem = {
    id?: string | undefined;
    text: string;
    type: string;
    retention?: string | undefined;
    confidence?: number | undefined;
    status: MemoryRememberedItemStatus;
};
/** @internal */
export declare const MemoryRememberedItemStatus$inboundSchema: z.ZodMiniEnum<typeof MemoryRememberedItemStatus>;
/** @internal */
export declare const MemoryRememberedItem$inboundSchema: z.ZodMiniType<MemoryRememberedItem, unknown>;
export declare function memoryRememberedItemFromJSON(jsonString: string): SafeParseResult<MemoryRememberedItem, SDKValidationError>;
//# sourceMappingURL=memory-remembered-item.d.ts.map
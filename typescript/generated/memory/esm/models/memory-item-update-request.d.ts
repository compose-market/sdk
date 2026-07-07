import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const MemoryItemUpdateRequestStatus: {
    readonly Active: "active";
    readonly Superseded: "superseded";
    readonly Archived: "archived";
};
export type MemoryItemUpdateRequestStatus = ClosedEnum<typeof MemoryItemUpdateRequestStatus>;
export type MemoryItemUpdateRequest = {
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    content?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    retention?: string | undefined;
    confidence?: number | undefined;
    status?: MemoryItemUpdateRequestStatus | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const MemoryItemUpdateRequestStatus$outboundSchema: z.ZodMiniEnum<typeof MemoryItemUpdateRequestStatus>;
/** @internal */
export type MemoryItemUpdateRequest$Outbound = {
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    content?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    retention?: string | undefined;
    confidence?: number | undefined;
    status?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const MemoryItemUpdateRequest$outboundSchema: z.ZodMiniType<MemoryItemUpdateRequest$Outbound, MemoryItemUpdateRequest>;
export declare function memoryItemUpdateRequestToJSON(memoryItemUpdateRequest: MemoryItemUpdateRequest): string;
//# sourceMappingURL=memory-item-update-request.d.ts.map
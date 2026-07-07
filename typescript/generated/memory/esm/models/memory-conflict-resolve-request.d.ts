import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const Resolution: {
    readonly Supersede: "supersede";
    readonly Keep: "keep";
    readonly Merge: "merge";
    readonly Ignore: "ignore";
};
export type Resolution = ClosedEnum<typeof Resolution>;
export type MemoryConflictResolveRequest = {
    agentWallet?: string | undefined;
    resolution: Resolution;
    winningMemoryId?: string | undefined;
    reason?: string | undefined;
};
/** @internal */
export declare const Resolution$outboundSchema: z.ZodMiniEnum<typeof Resolution>;
/** @internal */
export type MemoryConflictResolveRequest$Outbound = {
    agentWallet?: string | undefined;
    resolution: string;
    winningMemoryId?: string | undefined;
    reason?: string | undefined;
};
/** @internal */
export declare const MemoryConflictResolveRequest$outboundSchema: z.ZodMiniType<MemoryConflictResolveRequest$Outbound, MemoryConflictResolveRequest>;
export declare function memoryConflictResolveRequestToJSON(memoryConflictResolveRequest: MemoryConflictResolveRequest): string;
//# sourceMappingURL=memory-conflict-resolve-request.d.ts.map
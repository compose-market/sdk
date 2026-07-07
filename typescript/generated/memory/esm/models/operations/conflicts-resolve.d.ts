import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ConflictsResolveRequest = {
    id: string;
    body: models.MemoryConflictResolveRequest;
};
/** @internal */
export type ConflictsResolveRequest$Outbound = {
    id: string;
    body: models.MemoryConflictResolveRequest$Outbound;
};
/** @internal */
export declare const ConflictsResolveRequest$outboundSchema: z.ZodMiniType<ConflictsResolveRequest$Outbound, ConflictsResolveRequest>;
export declare function conflictsResolveRequestToJSON(conflictsResolveRequest: ConflictsResolveRequest): string;
//# sourceMappingURL=conflicts-resolve.d.ts.map
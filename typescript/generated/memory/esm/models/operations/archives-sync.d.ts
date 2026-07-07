import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ArchivesSyncRequest = {
    archiveId: string;
    body: models.ArchiveSyncRequest;
};
/** @internal */
export type ArchivesSyncRequest$Outbound = {
    archiveId: string;
    body: models.ArchiveSyncRequest$Outbound;
};
/** @internal */
export declare const ArchivesSyncRequest$outboundSchema: z.ZodMiniType<ArchivesSyncRequest$Outbound, ArchivesSyncRequest>;
export declare function archivesSyncRequestToJSON(archivesSyncRequest: ArchivesSyncRequest): string;
//# sourceMappingURL=archives-sync.d.ts.map
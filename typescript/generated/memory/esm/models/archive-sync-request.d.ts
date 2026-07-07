import * as z from "zod/v4-mini";
export type ArchiveSyncRequest = {
    agentWallet: string;
};
/** @internal */
export type ArchiveSyncRequest$Outbound = {
    agentWallet: string;
};
/** @internal */
export declare const ArchiveSyncRequest$outboundSchema: z.ZodMiniType<ArchiveSyncRequest$Outbound, ArchiveSyncRequest>;
export declare function archiveSyncRequestToJSON(archiveSyncRequest: ArchiveSyncRequest): string;
//# sourceMappingURL=archive-sync-request.d.ts.map
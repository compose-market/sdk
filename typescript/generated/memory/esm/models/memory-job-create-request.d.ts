import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { MemoryTimeRange, MemoryTimeRange$Outbound } from "./memory-time-range.js";
export declare const MemoryJobCreateRequestType: {
    readonly Consolidate: "consolidate";
    readonly PatternsExtract: "patterns_extract";
    readonly ArchiveCreate: "archive_create";
    readonly DecayUpdate: "decay_update";
    readonly Cleanup: "cleanup";
};
export type MemoryJobCreateRequestType = ClosedEnum<typeof MemoryJobCreateRequestType>;
export declare const MemoryJobCreateRequestExecution: {
    readonly Inline: "inline";
    readonly Temporal: "temporal";
};
export type MemoryJobCreateRequestExecution = ClosedEnum<typeof MemoryJobCreateRequestExecution>;
export type MemoryJobCreateRequest = {
    type: MemoryJobCreateRequestType;
    execution?: MemoryJobCreateRequestExecution | undefined;
    agentWallet?: string | undefined;
    agentWallets?: Array<string> | undefined;
    timeRange?: MemoryTimeRange | undefined;
    dateRange?: MemoryTimeRange | undefined;
    confidenceThreshold?: number | undefined;
    batchSize?: number | undefined;
    halfLifeDays?: number | undefined;
    olderThanDays?: number | undefined;
    compress?: boolean | undefined;
    syncToIpfs?: boolean | undefined;
};
/** @internal */
export declare const MemoryJobCreateRequestType$outboundSchema: z.ZodMiniEnum<typeof MemoryJobCreateRequestType>;
/** @internal */
export declare const MemoryJobCreateRequestExecution$outboundSchema: z.ZodMiniEnum<typeof MemoryJobCreateRequestExecution>;
/** @internal */
export type MemoryJobCreateRequest$Outbound = {
    type: string;
    execution?: string | undefined;
    agentWallet?: string | undefined;
    agentWallets?: Array<string> | undefined;
    timeRange?: MemoryTimeRange$Outbound | undefined;
    dateRange?: MemoryTimeRange$Outbound | undefined;
    confidenceThreshold?: number | undefined;
    batchSize?: number | undefined;
    halfLifeDays?: number | undefined;
    olderThanDays?: number | undefined;
    compress?: boolean | undefined;
    syncToIpfs?: boolean | undefined;
};
/** @internal */
export declare const MemoryJobCreateRequest$outboundSchema: z.ZodMiniType<MemoryJobCreateRequest$Outbound, MemoryJobCreateRequest>;
export declare function memoryJobCreateRequestToJSON(memoryJobCreateRequest: MemoryJobCreateRequest): string;
//# sourceMappingURL=memory-job-create-request.d.ts.map
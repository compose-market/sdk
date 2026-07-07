import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const MemoryJobRecordType: {
    readonly Consolidate: "consolidate";
    readonly PatternsExtract: "patterns_extract";
    readonly ArchiveCreate: "archive_create";
    readonly DecayUpdate: "decay_update";
    readonly Cleanup: "cleanup";
};
export type MemoryJobRecordType = OpenEnum<typeof MemoryJobRecordType>;
export declare const MemoryJobRecordExecution: {
    readonly Inline: "inline";
    readonly Temporal: "temporal";
};
export type MemoryJobRecordExecution = OpenEnum<typeof MemoryJobRecordExecution>;
export declare const MemoryJobRecordStatus: {
    readonly Running: "running";
    readonly Completed: "completed";
    readonly Failed: "failed";
};
export type MemoryJobRecordStatus = OpenEnum<typeof MemoryJobRecordStatus>;
export type MemoryJobRecord = {
    jobId: string;
    type: MemoryJobRecordType;
    execution: MemoryJobRecordExecution;
    status: MemoryJobRecordStatus;
    agentWallet?: string | undefined;
    temporalWorkflowId?: string | undefined;
    temporalRunId?: string | undefined;
    data?: any | undefined;
    error?: string | undefined;
    createdAt: number;
    completedAt?: number | undefined;
};
/** @internal */
export declare const MemoryJobRecordType$inboundSchema: z.ZodMiniType<MemoryJobRecordType, unknown>;
/** @internal */
export declare const MemoryJobRecordExecution$inboundSchema: z.ZodMiniType<MemoryJobRecordExecution, unknown>;
/** @internal */
export declare const MemoryJobRecordStatus$inboundSchema: z.ZodMiniType<MemoryJobRecordStatus, unknown>;
/** @internal */
export declare const MemoryJobRecord$inboundSchema: z.ZodMiniType<MemoryJobRecord, unknown>;
export declare function memoryJobRecordFromJSON(jsonString: string): SafeParseResult<MemoryJobRecord, SDKValidationError>;
//# sourceMappingURL=memory-job-record.d.ts.map
import * as z from "zod/v4-mini";
export type MemoryScheduleCreateRequest = {
    agentWallets: Array<string>;
};
/** @internal */
export type MemoryScheduleCreateRequest$Outbound = {
    agentWallets: Array<string>;
};
/** @internal */
export declare const MemoryScheduleCreateRequest$outboundSchema: z.ZodMiniType<MemoryScheduleCreateRequest$Outbound, MemoryScheduleCreateRequest>;
export declare function memoryScheduleCreateRequestToJSON(memoryScheduleCreateRequest: MemoryScheduleCreateRequest): string;
//# sourceMappingURL=memory-schedule-create-request.d.ts.map
import * as z from "zod/v4-mini";
export type MemoryTimeRange = {
    start: number;
    end: number;
};
/** @internal */
export type MemoryTimeRange$Outbound = {
    start: number;
    end: number;
};
/** @internal */
export declare const MemoryTimeRange$outboundSchema: z.ZodMiniType<MemoryTimeRange$Outbound, MemoryTimeRange>;
export declare function memoryTimeRangeToJSON(memoryTimeRange: MemoryTimeRange): string;
//# sourceMappingURL=memory-time-range.d.ts.map
import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type MemoryStatsResponse = {
    totalVectors: number;
    totalTranscripts: number;
    avgDecayScore: number;
    oldestVector: number;
    newestVector: number;
    byType: {
        [k: string]: number;
    };
};
/** @internal */
export declare const MemoryStatsResponse$inboundSchema: z.ZodMiniType<MemoryStatsResponse, unknown>;
export declare function memoryStatsResponseFromJSON(jsonString: string): SafeParseResult<MemoryStatsResponse, SDKValidationError>;
//# sourceMappingURL=memory-stats-response.d.ts.map
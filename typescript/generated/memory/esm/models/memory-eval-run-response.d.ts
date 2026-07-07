import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const MemoryEvalRunResponseStatus: {
    readonly Completed: "completed";
};
export type MemoryEvalRunResponseStatus = ClosedEnum<typeof MemoryEvalRunResponseStatus>;
export type Scores = {
    recallAtK: number;
    precisionAtK: number;
    avgContextCharacters: number;
    cases: number;
};
export type Result = {
    query: string;
    hit: boolean;
    returned: number;
    contextCharacters: number;
};
export type MemoryEvalRunResponse = {
    evalRunId: string;
    status: MemoryEvalRunResponseStatus;
    scores: Scores;
    avgSearchLatencyMs?: number | undefined;
    results: Array<Result>;
};
/** @internal */
export declare const MemoryEvalRunResponseStatus$inboundSchema: z.ZodMiniEnum<typeof MemoryEvalRunResponseStatus>;
/** @internal */
export declare const Scores$inboundSchema: z.ZodMiniType<Scores, unknown>;
export declare function scoresFromJSON(jsonString: string): SafeParseResult<Scores, SDKValidationError>;
/** @internal */
export declare const Result$inboundSchema: z.ZodMiniType<Result, unknown>;
export declare function resultFromJSON(jsonString: string): SafeParseResult<Result, SDKValidationError>;
/** @internal */
export declare const MemoryEvalRunResponse$inboundSchema: z.ZodMiniType<MemoryEvalRunResponse, unknown>;
export declare function memoryEvalRunResponseFromJSON(jsonString: string): SafeParseResult<MemoryEvalRunResponse, SDKValidationError>;
//# sourceMappingURL=memory-eval-run-response.d.ts.map
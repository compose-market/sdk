import * as z from "zod/v4-mini";
export type MemoryEvalTestCase = {
    query: string;
    expected?: string | undefined;
    expectedMemoryId?: string | undefined;
};
/** @internal */
export type MemoryEvalTestCase$Outbound = {
    query: string;
    expected?: string | undefined;
    expectedMemoryId?: string | undefined;
};
/** @internal */
export declare const MemoryEvalTestCase$outboundSchema: z.ZodMiniType<MemoryEvalTestCase$Outbound, MemoryEvalTestCase>;
export declare function memoryEvalTestCaseToJSON(memoryEvalTestCase: MemoryEvalTestCase): string;
//# sourceMappingURL=memory-eval-test-case.d.ts.map
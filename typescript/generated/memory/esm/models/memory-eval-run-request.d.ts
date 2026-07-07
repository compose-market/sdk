import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryLayer } from "./agent-memory-layer.js";
import { MemoryEvalTestCase, MemoryEvalTestCase$Outbound } from "./memory-eval-test-case.js";
export declare const MemoryEvalRunRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type MemoryEvalRunRequestScope = ClosedEnum<typeof MemoryEvalRunRequestScope>;
export type MemoryEvalRunRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: MemoryEvalRunRequestScope | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    layers?: Array<AgentMemoryLayer> | undefined;
    testCases: Array<MemoryEvalTestCase>;
};
/** @internal */
export declare const MemoryEvalRunRequestScope$outboundSchema: z.ZodMiniEnum<typeof MemoryEvalRunRequestScope>;
/** @internal */
export type MemoryEvalRunRequest$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    layers?: Array<string> | undefined;
    testCases: Array<MemoryEvalTestCase$Outbound>;
};
/** @internal */
export declare const MemoryEvalRunRequest$outboundSchema: z.ZodMiniType<MemoryEvalRunRequest$Outbound, MemoryEvalRunRequest>;
export declare function memoryEvalRunRequestToJSON(memoryEvalRunRequest: MemoryEvalRunRequest): string;
//# sourceMappingURL=memory-eval-run-request.d.ts.map
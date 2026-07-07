import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const MemoryVectorItemSource: {
    readonly Session: "session";
    readonly Knowledge: "knowledge";
    readonly Pattern: "pattern";
    readonly Archive: "archive";
    readonly Fact: "fact";
};
export type MemoryVectorItemSource = OpenEnum<typeof MemoryVectorItemSource>;
export declare const MemoryVectorItemScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type MemoryVectorItemScope = OpenEnum<typeof MemoryVectorItemScope>;
export type MemoryVectorItem = {
    id: string;
    vectorId?: string | undefined;
    content: string;
    score: number;
    source: MemoryVectorItemSource;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: MemoryVectorItemScope | undefined;
    haiId?: string | undefined;
    decayScore: number;
    accessCount: number;
    createdAt: number;
    embedding?: Array<number> | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    lastAccessedAt?: number | undefined;
    updatedAt?: number | undefined;
};
/** @internal */
export declare const MemoryVectorItemSource$inboundSchema: z.ZodMiniType<MemoryVectorItemSource, unknown>;
/** @internal */
export declare const MemoryVectorItemScope$inboundSchema: z.ZodMiniType<MemoryVectorItemScope, unknown>;
/** @internal */
export declare const MemoryVectorItem$inboundSchema: z.ZodMiniType<MemoryVectorItem, unknown>;
export declare function memoryVectorItemFromJSON(jsonString: string): SafeParseResult<MemoryVectorItem, SDKValidationError>;
//# sourceMappingURL=memory-vector-item.d.ts.map
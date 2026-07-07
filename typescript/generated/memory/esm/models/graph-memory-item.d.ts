import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type GraphMemoryItem = {
    id?: string | undefined;
    memory?: string | undefined;
    userId?: string | undefined;
    agentId?: string | undefined;
    runId?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    relations?: Array<{
        [k: string]: any;
    }> | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const GraphMemoryItem$inboundSchema: z.ZodMiniType<GraphMemoryItem, unknown>;
export declare function graphMemoryItemFromJSON(jsonString: string): SafeParseResult<GraphMemoryItem, SDKValidationError>;
//# sourceMappingURL=graph-memory-item.d.ts.map
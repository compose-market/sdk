import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { AgentMemoryCompactItem } from "./agent-memory-compact-item.js";
import { AgentMemoryContextUsage } from "./agent-memory-context-usage.js";
import { AgentMemoryLoopEnvelope } from "./agent-memory-loop-envelope.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type AgentMemoryContextResponse = {
    loop: AgentMemoryLoopEnvelope;
    contextId: string;
    prompt: string | null;
    items: Array<AgentMemoryCompactItem>;
    totals: {
        [k: string]: number;
    };
    contextUsage: AgentMemoryContextUsage;
    omitted: {
        [k: string]: number;
    };
    raw?: {
        [k: string]: Array<any>;
    } | undefined;
};
/** @internal */
export declare const AgentMemoryContextResponse$inboundSchema: z.ZodMiniType<AgentMemoryContextResponse, unknown>;
export declare function agentMemoryContextResponseFromJSON(jsonString: string): SafeParseResult<AgentMemoryContextResponse, SDKValidationError>;
//# sourceMappingURL=agent-memory-context-response.d.ts.map
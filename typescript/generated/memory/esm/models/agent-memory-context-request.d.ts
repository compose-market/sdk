import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryBudget, AgentMemoryBudget$Outbound } from "./agent-memory-budget.js";
import { AgentMemoryLayer } from "./agent-memory-layer.js";
export declare const AgentMemoryContextRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryContextRequestScope = ClosedEnum<typeof AgentMemoryContextRequestScope>;
export type AgentMemoryContextRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryContextRequestScope | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    query: string;
    layers?: Array<AgentMemoryLayer> | undefined;
    limit?: number | undefined;
    maxItems?: number | undefined;
    maxItemChars?: number | undefined;
    budget?: AgentMemoryBudget | undefined;
    includeRaw?: boolean | undefined;
};
/** @internal */
export declare const AgentMemoryContextRequestScope$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryContextRequestScope>;
/** @internal */
export type AgentMemoryContextRequest$Outbound = {
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
    query: string;
    layers?: Array<string> | undefined;
    limit?: number | undefined;
    maxItems?: number | undefined;
    maxItemChars?: number | undefined;
    budget?: AgentMemoryBudget$Outbound | undefined;
    includeRaw?: boolean | undefined;
};
/** @internal */
export declare const AgentMemoryContextRequest$outboundSchema: z.ZodMiniType<AgentMemoryContextRequest$Outbound, AgentMemoryContextRequest>;
export declare function agentMemoryContextRequestToJSON(agentMemoryContextRequest: AgentMemoryContextRequest): string;
//# sourceMappingURL=agent-memory-context-request.d.ts.map
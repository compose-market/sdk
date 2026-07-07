import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AgentMemoryLayer } from "./agent-memory-layer.js";
export declare const MemorySearchRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type MemorySearchRequestScope = ClosedEnum<typeof MemorySearchRequestScope>;
export type MemorySearchRequest = {
    query: string;
    agentWallet?: string | undefined;
    agentId?: string | undefined;
    userAddress?: string | undefined;
    userId?: string | undefined;
    threadId?: string | undefined;
    runId?: string | undefined;
    scope?: MemorySearchRequestScope | undefined;
    haiId?: string | undefined;
    limit?: number | undefined;
    layers?: Array<AgentMemoryLayer> | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    rerank?: boolean | undefined;
};
/** @internal */
export declare const MemorySearchRequestScope$outboundSchema: z.ZodMiniEnum<typeof MemorySearchRequestScope>;
/** @internal */
export type MemorySearchRequest$Outbound = {
    query: string;
    agentWallet?: string | undefined;
    agent_id?: string | undefined;
    userAddress?: string | undefined;
    user_id?: string | undefined;
    threadId?: string | undefined;
    runId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    limit?: number | undefined;
    layers?: Array<string> | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    rerank?: boolean | undefined;
};
/** @internal */
export declare const MemorySearchRequest$outboundSchema: z.ZodMiniType<MemorySearchRequest$Outbound, MemorySearchRequest>;
export declare function memorySearchRequestToJSON(memorySearchRequest: MemorySearchRequest): string;
//# sourceMappingURL=memory-search-request.d.ts.map
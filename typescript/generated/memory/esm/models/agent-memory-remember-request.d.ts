import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const AgentMemoryRememberRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type AgentMemoryRememberRequestScope = ClosedEnum<typeof AgentMemoryRememberRequestScope>;
export type AgentMemoryRememberRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: AgentMemoryRememberRequestScope | undefined;
    haiId?: string | undefined;
    filters?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    content: string;
    type?: string | undefined;
    retention?: string | undefined;
    conflictPolicy?: string | undefined;
    confidence?: number | undefined;
    enableGraph?: boolean | undefined;
};
/** @internal */
export declare const AgentMemoryRememberRequestScope$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryRememberRequestScope>;
/** @internal */
export type AgentMemoryRememberRequest$Outbound = {
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
    content: string;
    type?: string | undefined;
    retention?: string | undefined;
    conflictPolicy?: string | undefined;
    confidence?: number | undefined;
    enableGraph?: boolean | undefined;
};
/** @internal */
export declare const AgentMemoryRememberRequest$outboundSchema: z.ZodMiniType<AgentMemoryRememberRequest$Outbound, AgentMemoryRememberRequest>;
export declare function agentMemoryRememberRequestToJSON(agentMemoryRememberRequest: AgentMemoryRememberRequest): string;
//# sourceMappingURL=agent-memory-remember-request.d.ts.map
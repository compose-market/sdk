import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const MemoryAddRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type MemoryAddRequestScope = ClosedEnum<typeof MemoryAddRequestScope>;
export type MemoryAddRequest = {
    messages: Array<{
        [k: string]: any;
    }>;
    agentWallet?: string | undefined;
    agentId?: string | undefined;
    userAddress?: string | undefined;
    userId?: string | undefined;
    runId?: string | undefined;
    threadId?: string | undefined;
    scope?: MemoryAddRequestScope | undefined;
    haiId?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    enableGraph?: boolean | undefined;
};
/** @internal */
export declare const MemoryAddRequestScope$outboundSchema: z.ZodMiniEnum<typeof MemoryAddRequestScope>;
/** @internal */
export type MemoryAddRequest$Outbound = {
    messages: Array<{
        [k: string]: any;
    }>;
    agentWallet?: string | undefined;
    agent_id?: string | undefined;
    userAddress?: string | undefined;
    user_id?: string | undefined;
    runId?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    enableGraph?: boolean | undefined;
};
/** @internal */
export declare const MemoryAddRequest$outboundSchema: z.ZodMiniType<MemoryAddRequest$Outbound, MemoryAddRequest>;
export declare function memoryAddRequestToJSON(memoryAddRequest: MemoryAddRequest): string;
//# sourceMappingURL=memory-add-request.d.ts.map
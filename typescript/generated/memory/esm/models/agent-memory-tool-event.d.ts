import * as z from "zod/v4-mini";
export type AgentMemoryToolEvent = {
    name: string;
    toolName?: string | undefined;
    tool?: string | undefined;
    args?: {
        [k: string]: any;
    } | undefined;
    input?: {
        [k: string]: any;
    } | undefined;
    result?: string | undefined;
    output?: string | undefined;
    status?: string | undefined;
    timestamp?: number | undefined;
};
/** @internal */
export type AgentMemoryToolEvent$Outbound = {
    name: string;
    toolName?: string | undefined;
    tool?: string | undefined;
    args?: {
        [k: string]: any;
    } | undefined;
    input?: {
        [k: string]: any;
    } | undefined;
    result?: string | undefined;
    output?: string | undefined;
    status?: string | undefined;
    timestamp?: number | undefined;
};
/** @internal */
export declare const AgentMemoryToolEvent$outboundSchema: z.ZodMiniType<AgentMemoryToolEvent$Outbound, AgentMemoryToolEvent>;
export declare function agentMemoryToolEventToJSON(agentMemoryToolEvent: AgentMemoryToolEvent): string;
//# sourceMappingURL=agent-memory-tool-event.d.ts.map
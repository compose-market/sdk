import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const Role: {
    readonly User: "user";
    readonly Assistant: "assistant";
    readonly System: "system";
    readonly Tool: "tool";
};
export type Role = OpenEnum<typeof Role>;
export type ToolCall = {
    name: string;
    args: {
        [k: string]: any;
    };
};
export type AgentMemoryTurnMessage = {
    role: Role;
    content: string;
    timestamp?: number | undefined;
    toolCalls?: Array<ToolCall> | undefined;
};
/** @internal */
export declare const Role$inboundSchema: z.ZodMiniType<Role, unknown>;
/** @internal */
export declare const Role$outboundSchema: z.ZodMiniType<string, Role>;
/** @internal */
export declare const ToolCall$inboundSchema: z.ZodMiniType<ToolCall, unknown>;
/** @internal */
export type ToolCall$Outbound = {
    name: string;
    args: {
        [k: string]: any;
    };
};
/** @internal */
export declare const ToolCall$outboundSchema: z.ZodMiniType<ToolCall$Outbound, ToolCall>;
export declare function toolCallToJSON(toolCall: ToolCall): string;
export declare function toolCallFromJSON(jsonString: string): SafeParseResult<ToolCall, SDKValidationError>;
/** @internal */
export declare const AgentMemoryTurnMessage$inboundSchema: z.ZodMiniType<AgentMemoryTurnMessage, unknown>;
/** @internal */
export type AgentMemoryTurnMessage$Outbound = {
    role: string;
    content: string;
    timestamp?: number | undefined;
    toolCalls?: Array<ToolCall$Outbound> | undefined;
};
/** @internal */
export declare const AgentMemoryTurnMessage$outboundSchema: z.ZodMiniType<AgentMemoryTurnMessage$Outbound, AgentMemoryTurnMessage>;
export declare function agentMemoryTurnMessageToJSON(agentMemoryTurnMessage: AgentMemoryTurnMessage): string;
export declare function agentMemoryTurnMessageFromJSON(jsonString: string): SafeParseResult<AgentMemoryTurnMessage, SDKValidationError>;
//# sourceMappingURL=agent-memory-turn-message.d.ts.map
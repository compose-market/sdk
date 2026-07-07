import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const Mode: {
    readonly Compact: "compact";
    readonly Balanced: "balanced";
    readonly Recall: "recall";
};
export type Mode = ClosedEnum<typeof Mode>;
export type AgentMemoryBudget = {
    maxCharacters?: number | undefined;
    maxChars?: number | undefined;
    maxContextCharacters?: number | undefined;
    maxContextChars?: number | undefined;
    mode?: Mode | undefined;
};
/** @internal */
export declare const Mode$outboundSchema: z.ZodMiniEnum<typeof Mode>;
/** @internal */
export type AgentMemoryBudget$Outbound = {
    maxCharacters?: number | undefined;
    max_chars?: number | undefined;
    maxContextCharacters?: number | undefined;
    max_context_chars?: number | undefined;
    mode?: string | undefined;
};
/** @internal */
export declare const AgentMemoryBudget$outboundSchema: z.ZodMiniType<AgentMemoryBudget$Outbound, AgentMemoryBudget>;
export declare function agentMemoryBudgetToJSON(agentMemoryBudget: AgentMemoryBudget): string;
//# sourceMappingURL=agent-memory-budget.d.ts.map
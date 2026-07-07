import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const AgentMemoryLoopStep: {
    readonly PreTurn: "pre_turn";
    readonly PostTurn: "post_turn";
    readonly Remember: "remember";
};
export type AgentMemoryLoopStep = OpenEnum<typeof AgentMemoryLoopStep>;
/** @internal */
export declare const AgentMemoryLoopStep$inboundSchema: z.ZodMiniType<AgentMemoryLoopStep, unknown>;
//# sourceMappingURL=agent-memory-loop-step.d.ts.map
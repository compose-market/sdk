import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const AgentMemoryLayer: {
    readonly Working: "working";
    readonly Scene: "scene";
    readonly Graph: "graph";
    readonly Patterns: "patterns";
    readonly Archives: "archives";
    readonly Vectors: "vectors";
};
export type AgentMemoryLayer = ClosedEnum<typeof AgentMemoryLayer>;
/** @internal */
export declare const AgentMemoryLayer$outboundSchema: z.ZodMiniEnum<typeof AgentMemoryLayer>;
//# sourceMappingURL=agent-memory-layer.d.ts.map
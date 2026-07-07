import * as z from "zod/v4-mini";
import { ClosedEnum } from "../../types/enums.js";
export declare const PatternType: {
    readonly Routine: "routine";
    readonly Decision: "decision";
    readonly Response: "response";
    readonly ToolSequence: "tool_sequence";
};
export type PatternType = ClosedEnum<typeof PatternType>;
export type PatternsListRequest = {
    agentWallet?: string | undefined;
    patternType?: PatternType | undefined;
    minSuccessRate?: number | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const PatternType$outboundSchema: z.ZodMiniEnum<typeof PatternType>;
/** @internal */
export type PatternsListRequest$Outbound = {
    agentWallet?: string | undefined;
    patternType?: string | undefined;
    minSuccessRate?: number | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const PatternsListRequest$outboundSchema: z.ZodMiniType<PatternsListRequest$Outbound, PatternsListRequest>;
export declare function patternsListRequestToJSON(patternsListRequest: PatternsListRequest): string;
//# sourceMappingURL=patterns-list.d.ts.map
import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const ProceduralPatternScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type ProceduralPatternScope = OpenEnum<typeof ProceduralPatternScope>;
export declare const PatternType: {
    readonly Routine: "routine";
    readonly Decision: "decision";
    readonly Response: "response";
    readonly ToolSequence: "tool_sequence";
};
export type PatternType = OpenEnum<typeof PatternType>;
export declare const ProceduralPatternType: {
    readonly Intent: "intent";
    readonly Keyword: "keyword";
    readonly Context: "context";
    readonly State: "state";
};
export type ProceduralPatternType = OpenEnum<typeof ProceduralPatternType>;
export type Trigger = {
    type: ProceduralPatternType;
    value: string;
    conditions?: {
        [k: string]: any;
    } | undefined;
};
export type Step = {
    action: string;
    params?: {
        [k: string]: any;
    } | undefined;
    expectedOutcome?: string | undefined;
    order: number;
};
export type ProceduralPattern = {
    patternId: string;
    agentWallet: string;
    scope?: ProceduralPatternScope | undefined;
    haiId?: string | undefined;
    patternType: PatternType;
    trigger: Trigger;
    steps: Array<Step>;
    summary: string;
    successRate: number;
    executionCount: number;
    lastExecuted: number;
    metadata?: {
        [k: string]: any;
    } | undefined;
    createdAt: number;
    updatedAt?: number | undefined;
};
/** @internal */
export declare const ProceduralPatternScope$inboundSchema: z.ZodMiniType<ProceduralPatternScope, unknown>;
/** @internal */
export declare const PatternType$inboundSchema: z.ZodMiniType<PatternType, unknown>;
/** @internal */
export declare const ProceduralPatternType$inboundSchema: z.ZodMiniType<ProceduralPatternType, unknown>;
/** @internal */
export declare const Trigger$inboundSchema: z.ZodMiniType<Trigger, unknown>;
export declare function triggerFromJSON(jsonString: string): SafeParseResult<Trigger, SDKValidationError>;
/** @internal */
export declare const Step$inboundSchema: z.ZodMiniType<Step, unknown>;
export declare function stepFromJSON(jsonString: string): SafeParseResult<Step, SDKValidationError>;
/** @internal */
export declare const ProceduralPattern$inboundSchema: z.ZodMiniType<ProceduralPattern, unknown>;
export declare function proceduralPatternFromJSON(jsonString: string): SafeParseResult<ProceduralPattern, SDKValidationError>;
//# sourceMappingURL=procedural-pattern.d.ts.map
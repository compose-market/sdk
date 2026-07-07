import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type LearnedSkill = {
    skillId: string;
    name: string;
    description: string;
    category: string;
    trigger?: {
        [k: string]: any;
    } | undefined;
    spawnConfig?: {
        [k: string]: any;
    } | undefined;
    successRate: number;
    usageCount: number;
    creator: string;
    agents: Array<string>;
    tags?: Array<string> | undefined;
    createdAt: number;
    updatedAt?: number | undefined;
};
/** @internal */
export declare const LearnedSkill$inboundSchema: z.ZodMiniType<LearnedSkill, unknown>;
export declare function learnedSkillFromJSON(jsonString: string): SafeParseResult<LearnedSkill, SDKValidationError>;
//# sourceMappingURL=learned-skill.d.ts.map
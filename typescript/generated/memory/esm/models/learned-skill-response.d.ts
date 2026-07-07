import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { LearnedSkill } from "./learned-skill.js";
export type LearnedSkillResponse = {
    skill: LearnedSkill;
};
/** @internal */
export declare const LearnedSkillResponse$inboundSchema: z.ZodMiniType<LearnedSkillResponse, unknown>;
export declare function learnedSkillResponseFromJSON(jsonString: string): SafeParseResult<LearnedSkillResponse, SDKValidationError>;
//# sourceMappingURL=learned-skill-response.d.ts.map
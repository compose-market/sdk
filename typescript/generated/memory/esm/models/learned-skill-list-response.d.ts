import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { LearnedSkill } from "./learned-skill.js";
export type LearnedSkillListResponse = {
    skills: Array<LearnedSkill>;
};
/** @internal */
export declare const LearnedSkillListResponse$inboundSchema: z.ZodMiniType<LearnedSkillListResponse, unknown>;
export declare function learnedSkillListResponseFromJSON(jsonString: string): SafeParseResult<LearnedSkillListResponse, SDKValidationError>;
//# sourceMappingURL=learned-skill-list-response.d.ts.map
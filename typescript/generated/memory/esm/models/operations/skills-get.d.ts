import * as z from "zod/v4-mini";
export type SkillsGetRequest = {
    skillId: string;
    agentWallet?: string | undefined;
};
/** @internal */
export type SkillsGetRequest$Outbound = {
    skillId: string;
    agentWallet?: string | undefined;
};
/** @internal */
export declare const SkillsGetRequest$outboundSchema: z.ZodMiniType<SkillsGetRequest$Outbound, SkillsGetRequest>;
export declare function skillsGetRequestToJSON(skillsGetRequest: SkillsGetRequest): string;
//# sourceMappingURL=skills-get.d.ts.map
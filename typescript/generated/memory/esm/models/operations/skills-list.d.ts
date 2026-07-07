import * as z from "zod/v4-mini";
export type SkillsListRequest = {
    agentWallet?: string | undefined;
    category?: string | undefined;
    limit?: number | undefined;
};
/** @internal */
export type SkillsListRequest$Outbound = {
    agentWallet?: string | undefined;
    category?: string | undefined;
    limit?: number | undefined;
};
/** @internal */
export declare const SkillsListRequest$outboundSchema: z.ZodMiniType<SkillsListRequest$Outbound, SkillsListRequest>;
export declare function skillsListRequestToJSON(skillsListRequest: SkillsListRequest): string;
//# sourceMappingURL=skills-list.d.ts.map
import * as z from "zod/v4-mini";
import { AttachmentInput, AttachmentInput$Outbound } from "./attachment-input.js";
export type AgentStreamRequest = {
    message: string;
    threadId?: string | undefined;
    runId?: string | undefined;
    workflowWallet?: string | undefined;
    userAddress?: string | undefined;
    attachments?: Array<AttachmentInput> | undefined;
    sessionGrants?: Array<string> | undefined;
    cloudPermissions?: Array<string> | undefined;
    backpackAccounts?: Array<{
        [k: string]: any;
    }> | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export type AgentStreamRequest$Outbound = {
    message: string;
    threadId?: string | undefined;
    runId?: string | undefined;
    workflowWallet?: string | undefined;
    userAddress?: string | undefined;
    attachments?: Array<AttachmentInput$Outbound> | undefined;
    sessionGrants?: Array<string> | undefined;
    cloudPermissions?: Array<string> | undefined;
    backpackAccounts?: Array<{
        [k: string]: any;
    }> | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const AgentStreamRequest$outboundSchema: z.ZodMiniType<AgentStreamRequest$Outbound, AgentStreamRequest>;
export declare function agentStreamRequestToJSON(agentStreamRequest: AgentStreamRequest): string;
//# sourceMappingURL=agent-stream-request.d.ts.map
import * as z from "zod/v4-mini";
import { AttachmentInput, AttachmentInput$Outbound } from "./attachment-input.js";
export type WorkflowStreamRequest = {
    message: string;
    threadId?: string | undefined;
    image?: string | undefined;
    audio?: string | undefined;
    attachments?: Array<AttachmentInput> | undefined;
    continuous?: boolean | undefined;
    runId?: string | undefined;
    lastEventIndex?: number | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export type WorkflowStreamRequest$Outbound = {
    message: string;
    threadId?: string | undefined;
    image?: string | undefined;
    audio?: string | undefined;
    attachments?: Array<AttachmentInput$Outbound> | undefined;
    continuous?: boolean | undefined;
    runId?: string | undefined;
    lastEventIndex?: number | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const WorkflowStreamRequest$outboundSchema: z.ZodMiniType<WorkflowStreamRequest$Outbound, WorkflowStreamRequest>;
export declare function workflowStreamRequestToJSON(workflowStreamRequest: WorkflowStreamRequest): string;
//# sourceMappingURL=workflow-stream-request.d.ts.map
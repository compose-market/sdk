import * as z from "zod/v4-mini";
export type WorkflowExecutePayload = {
    walletAddress: string;
    id?: string | undefined;
    input?: any | undefined;
    message?: string | undefined;
    threadId?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export type WorkflowExecutePayload$Outbound = {
    walletAddress: string;
    id?: string | undefined;
    input?: any | undefined;
    message?: string | undefined;
    threadId?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const WorkflowExecutePayload$outboundSchema: z.ZodMiniType<WorkflowExecutePayload$Outbound, WorkflowExecutePayload>;
export declare function workflowExecutePayloadToJSON(workflowExecutePayload: WorkflowExecutePayload): string;
//# sourceMappingURL=workflow-execute-payload.d.ts.map
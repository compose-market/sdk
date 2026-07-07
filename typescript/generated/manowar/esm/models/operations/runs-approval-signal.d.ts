import * as z from "zod/v4-mini";
import { ClosedEnum } from "../../types/enums.js";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
/**
 * Production API gateway for public workflow approvals.
 */
export declare const RunsApprovalSignalServerComposeApi = "compose-api";
export declare const RunsApprovalSignalServerList: {
    "compose-api": string;
};
export declare const Status: {
    readonly Approved: "approved";
    readonly Rejected: "rejected";
};
export type Status = ClosedEnum<typeof Status>;
export type RunsApprovalSignalRequestBody = {
    stepKey: string;
    status: Status;
    approver?: string | undefined;
    reason?: string | undefined;
};
export type RunsApprovalSignalRequest = {
    walletAddress: string;
    runId: string;
    body: RunsApprovalSignalRequestBody;
};
/**
 * Approval signal accepted.
 */
export type RunsApprovalSignalResponse = {
    success: boolean;
};
/** @internal */
export declare const Status$outboundSchema: z.ZodMiniEnum<typeof Status>;
/** @internal */
export type RunsApprovalSignalRequestBody$Outbound = {
    stepKey: string;
    status: string;
    approver?: string | undefined;
    reason?: string | undefined;
};
/** @internal */
export declare const RunsApprovalSignalRequestBody$outboundSchema: z.ZodMiniType<RunsApprovalSignalRequestBody$Outbound, RunsApprovalSignalRequestBody>;
export declare function runsApprovalSignalRequestBodyToJSON(runsApprovalSignalRequestBody: RunsApprovalSignalRequestBody): string;
/** @internal */
export type RunsApprovalSignalRequest$Outbound = {
    walletAddress: string;
    runId: string;
    body: RunsApprovalSignalRequestBody$Outbound;
};
/** @internal */
export declare const RunsApprovalSignalRequest$outboundSchema: z.ZodMiniType<RunsApprovalSignalRequest$Outbound, RunsApprovalSignalRequest>;
export declare function runsApprovalSignalRequestToJSON(runsApprovalSignalRequest: RunsApprovalSignalRequest): string;
/** @internal */
export declare const RunsApprovalSignalResponse$inboundSchema: z.ZodMiniType<RunsApprovalSignalResponse, unknown>;
export declare function runsApprovalSignalResponseFromJSON(jsonString: string): SafeParseResult<RunsApprovalSignalResponse, SDKValidationError>;
//# sourceMappingURL=runs-approval-signal.d.ts.map
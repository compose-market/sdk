import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const WorkingSessionUpdateRequestScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type WorkingSessionUpdateRequestScope = ClosedEnum<typeof WorkingSessionUpdateRequestScope>;
export type WorkingSessionUpdateRequest = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: WorkingSessionUpdateRequestScope | undefined;
    haiId?: string | undefined;
    context?: Array<string> | undefined;
    entities?: {
        [k: string]: any;
    } | undefined;
    state?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    replace?: boolean | undefined;
};
/** @internal */
export declare const WorkingSessionUpdateRequestScope$outboundSchema: z.ZodMiniEnum<typeof WorkingSessionUpdateRequestScope>;
/** @internal */
export type WorkingSessionUpdateRequest$Outbound = {
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: string | undefined;
    haiId?: string | undefined;
    context?: Array<string> | undefined;
    entities?: {
        [k: string]: any;
    } | undefined;
    state?: {
        [k: string]: any;
    } | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    replace?: boolean | undefined;
};
/** @internal */
export declare const WorkingSessionUpdateRequest$outboundSchema: z.ZodMiniType<WorkingSessionUpdateRequest$Outbound, WorkingSessionUpdateRequest>;
export declare function workingSessionUpdateRequestToJSON(workingSessionUpdateRequest: WorkingSessionUpdateRequest): string;
//# sourceMappingURL=working-session-update-request.d.ts.map
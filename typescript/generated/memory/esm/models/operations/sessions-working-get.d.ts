import * as z from "zod/v4-mini";
export type SessionsWorkingGetRequest = {
    sessionId: string;
    agentWallet: string;
};
/** @internal */
export type SessionsWorkingGetRequest$Outbound = {
    sessionId: string;
    agentWallet: string;
};
/** @internal */
export declare const SessionsWorkingGetRequest$outboundSchema: z.ZodMiniType<SessionsWorkingGetRequest$Outbound, SessionsWorkingGetRequest>;
export declare function sessionsWorkingGetRequestToJSON(sessionsWorkingGetRequest: SessionsWorkingGetRequest): string;
//# sourceMappingURL=sessions-working-get.d.ts.map
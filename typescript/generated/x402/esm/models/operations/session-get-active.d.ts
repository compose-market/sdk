import * as z from "zod/v4-mini";
export type SessionGetActiveRequest = {
    xSessionUserAddress: string;
    xChainId: number;
};
/** @internal */
export type SessionGetActiveRequest$Outbound = {
    "x-session-user-address": string;
    "x-chain-id": number;
};
/** @internal */
export declare const SessionGetActiveRequest$outboundSchema: z.ZodMiniType<SessionGetActiveRequest$Outbound, SessionGetActiveRequest>;
export declare function sessionGetActiveRequestToJSON(sessionGetActiveRequest: SessionGetActiveRequest): string;
//# sourceMappingURL=session-get-active.d.ts.map
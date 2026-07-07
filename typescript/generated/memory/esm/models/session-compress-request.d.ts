import * as z from "zod/v4-mini";
export type SessionCompressRequest = {
    agentWallet: string;
    coordinatorModel: string;
};
/** @internal */
export type SessionCompressRequest$Outbound = {
    agentWallet: string;
    coordinatorModel: string;
};
/** @internal */
export declare const SessionCompressRequest$outboundSchema: z.ZodMiniType<SessionCompressRequest$Outbound, SessionCompressRequest>;
export declare function sessionCompressRequestToJSON(sessionCompressRequest: SessionCompressRequest): string;
//# sourceMappingURL=session-compress-request.d.ts.map
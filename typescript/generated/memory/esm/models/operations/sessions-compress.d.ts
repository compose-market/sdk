import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type SessionsCompressRequest = {
    sessionId: string;
    body: models.SessionCompressRequest;
};
/** @internal */
export type SessionsCompressRequest$Outbound = {
    sessionId: string;
    body: models.SessionCompressRequest$Outbound;
};
/** @internal */
export declare const SessionsCompressRequest$outboundSchema: z.ZodMiniType<SessionsCompressRequest$Outbound, SessionsCompressRequest>;
export declare function sessionsCompressRequestToJSON(sessionsCompressRequest: SessionsCompressRequest): string;
//# sourceMappingURL=sessions-compress.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type SessionsWorkingUpdateRequest = {
    sessionId: string;
    body: models.WorkingSessionUpdateRequest;
};
/** @internal */
export type SessionsWorkingUpdateRequest$Outbound = {
    sessionId: string;
    body: models.WorkingSessionUpdateRequest$Outbound;
};
/** @internal */
export declare const SessionsWorkingUpdateRequest$outboundSchema: z.ZodMiniType<SessionsWorkingUpdateRequest$Outbound, SessionsWorkingUpdateRequest>;
export declare function sessionsWorkingUpdateRequestToJSON(sessionsWorkingUpdateRequest: SessionsWorkingUpdateRequest): string;
//# sourceMappingURL=sessions-working-update.d.ts.map
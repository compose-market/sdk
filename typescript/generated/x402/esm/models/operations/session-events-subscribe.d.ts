import * as z from "zod/v4-mini";
export type SessionEventsSubscribeRequest = {
    userAddress: string;
    chainId: number;
};
/** @internal */
export type SessionEventsSubscribeRequest$Outbound = {
    userAddress: string;
    chainId: number;
};
/** @internal */
export declare const SessionEventsSubscribeRequest$outboundSchema: z.ZodMiniType<SessionEventsSubscribeRequest$Outbound, SessionEventsSubscribeRequest>;
export declare function sessionEventsSubscribeRequestToJSON(sessionEventsSubscribeRequest: SessionEventsSubscribeRequest): string;
//# sourceMappingURL=session-events-subscribe.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type DisconnectRequest = {
    channel: models.ChannelName;
    body: models.ChannelDisconnectRequest;
};
/** @internal */
export type DisconnectRequest$Outbound = {
    channel: string;
    body: models.ChannelDisconnectRequest$Outbound;
};
/** @internal */
export declare const DisconnectRequest$outboundSchema: z.ZodMiniType<DisconnectRequest$Outbound, DisconnectRequest>;
export declare function disconnectRequestToJSON(disconnectRequest: DisconnectRequest): string;
//# sourceMappingURL=disconnect.d.ts.map
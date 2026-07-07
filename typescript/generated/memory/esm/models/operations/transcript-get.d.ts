import * as z from "zod/v4-mini";
import { ClosedEnum } from "../../types/enums.js";
export declare const Type: {
    readonly SessionId: "sessionId";
    readonly ThreadId: "threadId";
};
export type Type = ClosedEnum<typeof Type>;
export type TranscriptGetRequest = {
    id: string;
    type?: Type | undefined;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
};
/** @internal */
export declare const Type$outboundSchema: z.ZodMiniEnum<typeof Type>;
/** @internal */
export type TranscriptGetRequest$Outbound = {
    id: string;
    type?: string | undefined;
    agentWallet?: string | undefined;
    userAddress?: string | undefined;
};
/** @internal */
export declare const TranscriptGetRequest$outboundSchema: z.ZodMiniType<TranscriptGetRequest$Outbound, TranscriptGetRequest>;
export declare function transcriptGetRequestToJSON(transcriptGetRequest: TranscriptGetRequest): string;
//# sourceMappingURL=transcript-get.d.ts.map
import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type GetRequest = {
    model: string;
    provider?: models.ModelProvider | undefined;
};
/** @internal */
export type GetRequest$Outbound = {
    model: string;
    provider?: string | undefined;
};
/** @internal */
export declare const GetRequest$outboundSchema: z.ZodMiniType<GetRequest$Outbound, GetRequest>;
export declare function getRequestToJSON(getRequest: GetRequest): string;
//# sourceMappingURL=get.d.ts.map
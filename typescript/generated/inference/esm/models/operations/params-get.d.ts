import * as z from "zod/v4-mini";
import * as models from "../index.js";
export type ParamsGetRequest = {
    model: string;
    provider?: models.ModelProvider | undefined;
};
/** @internal */
export type ParamsGetRequest$Outbound = {
    model: string;
    provider?: string | undefined;
};
/** @internal */
export declare const ParamsGetRequest$outboundSchema: z.ZodMiniType<ParamsGetRequest$Outbound, ParamsGetRequest>;
export declare function paramsGetRequestToJSON(paramsGetRequest: ParamsGetRequest): string;
//# sourceMappingURL=params-get.d.ts.map
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Payments extends ClientSDK {
    prepare(security: operations.PrepareSecurity, request: operations.PrepareRequest, options?: RequestOptions): Promise<operations.PrepareResponse>;
    settle(request: operations.SettleRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    abort(request: operations.AbortRequest, options?: RequestOptions): Promise<operations.AbortResponse>;
    modelMeter(request: models.ModelMeterRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
}
//# sourceMappingURL=payments.d.ts.map
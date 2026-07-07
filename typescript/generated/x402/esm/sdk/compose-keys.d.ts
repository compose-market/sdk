import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class ComposeKeys extends ClientSDK {
    sessionGetActive(request: operations.SessionGetActiveRequest, options?: RequestOptions): Promise<models.ActiveSessionMetadata>;
    sessionEventsSubscribe(request: operations.SessionEventsSubscribeRequest, options?: RequestOptions): Promise<string>;
    create(request: operations.CreateRequest, options?: RequestOptions): Promise<models.KeyCreateResponse>;
    list(request: operations.ListRequest, options?: RequestOptions): Promise<operations.ListResponse>;
    get(request: operations.GetRequest, options?: RequestOptions): Promise<models.KeyRecord>;
    revoke(request: operations.RevokeRequest, options?: RequestOptions): Promise<operations.RevokeResponse>;
}
//# sourceMappingURL=compose-keys.d.ts.map
import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Models extends ClientSDK {
    list(request?: operations.ListRequest | undefined, options?: RequestOptions): Promise<models.ModelListResponse>;
    listAll(options?: RequestOptions): Promise<models.ModelListResponse>;
    search(request: models.ModelSearchRequest, options?: RequestOptions): Promise<models.ModelSearchResponse>;
    get(request: operations.GetRequest, options?: RequestOptions): Promise<models.Model>;
    paramsGet(request: operations.ParamsGetRequest, options?: RequestOptions): Promise<models.ModelParamsResponse>;
}
//# sourceMappingURL=models.d.ts.map
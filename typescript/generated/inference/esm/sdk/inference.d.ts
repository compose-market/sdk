import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Inference extends ClientSDK {
    responsesCreate(security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest & {
        body: {
            stream?: false | undefined;
        };
    }, options?: RequestOptions): Promise<operations.ResponsesCreateResponse>;
    responsesCreate(security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest & {
        body: {
            stream: true;
        };
    }, options?: RequestOptions): Promise<operations.ResponsesCreateResponse>;
    responsesCreate(security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest, options?: RequestOptions): Promise<operations.ResponsesCreateResponse>;
    responsesGet(request: operations.ResponsesGetRequest, options?: RequestOptions): Promise<models.ResponseObject>;
    responsesInputItemsList(request: operations.ResponsesInputItemsListRequest, options?: RequestOptions): Promise<operations.ResponsesInputItemsListResponse>;
    responsesCancel(request: operations.ResponsesCancelRequest, options?: RequestOptions): Promise<models.ResponseObject>;
}
//# sourceMappingURL=inference.d.ts.map
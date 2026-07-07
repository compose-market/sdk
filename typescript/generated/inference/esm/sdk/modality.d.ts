import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Modality extends ClientSDK {
    list(options?: RequestOptions): Promise<models.ModalityListResponse>;
    get(request: operations.ModalityGetRequest, options?: RequestOptions): Promise<models.ModalityCatalogEntry>;
    operationsList(request: operations.OperationsListRequest, options?: RequestOptions): Promise<models.OperationListResponse>;
    operationModelsList(request: operations.OperationModelsListRequest, options?: RequestOptions): Promise<models.OperationModelsResponse>;
}
//# sourceMappingURL=modality.d.ts.map
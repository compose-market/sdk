import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
export declare class Workspace extends ClientSDK {
    index(request: operations.IndexRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    search(request: operations.SearchRequest, options?: RequestOptions): Promise<operations.SearchResponse>;
}
//# sourceMappingURL=workspace.d.ts.map
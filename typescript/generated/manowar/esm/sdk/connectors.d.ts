import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
export declare class Connectors extends ClientSDK {
    onchainList(options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    onchainGet(request: operations.OnchainGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    onchainActionGet(request: operations.OnchainActionGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    onchainActionExecute(request: operations.OnchainActionExecuteRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpList(request?: operations.McpListRequest | undefined, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpSearch(request: operations.McpSearchRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpCategoriesList(options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpTagsList(options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpMetaGet(options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpGet(request: operations.McpGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpActionsList(request: operations.McpActionsListRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpSpawnGet(request: operations.McpSpawnGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpActionExecute(request: operations.McpActionExecuteRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    mcpInspect(request: operations.McpInspectRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
}
//# sourceMappingURL=connectors.d.ts.map
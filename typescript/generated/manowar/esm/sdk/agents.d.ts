import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
export declare class Agents extends ClientSDK {
    streamCreate(request: operations.StreamCreateRequest, options?: RequestOptions): Promise<operations.StreamCreateResponse>;
    responsesCreate(request: operations.ResponsesCreateRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    runsStateGet(request: operations.RunsStateGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
}
//# sourceMappingURL=agents.d.ts.map
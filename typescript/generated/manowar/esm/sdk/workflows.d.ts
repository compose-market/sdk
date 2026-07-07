import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as operations from "../models/operations/index.js";
export declare class Workflows extends ClientSDK {
    execute(request: operations.ExecuteRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    streamCreate(request: operations.WorkflowStreamCreateRequest, options?: RequestOptions): Promise<operations.WorkflowStreamCreateResponse>;
    stop(request: operations.StopRequest, options?: RequestOptions): Promise<operations.StopResponse>;
    runsStateGet(request: operations.WorkflowRunsStateGetRequest, options?: RequestOptions): Promise<{
        [k: string]: any;
    }>;
    runsApprovalSignal(request: operations.RunsApprovalSignalRequest, options?: RequestOptions): Promise<operations.RunsApprovalSignalResponse>;
    runAlias(request: operations.RunAliasRequest, options?: RequestOptions): Promise<string>;
}
//# sourceMappingURL=workflows.d.ts.map
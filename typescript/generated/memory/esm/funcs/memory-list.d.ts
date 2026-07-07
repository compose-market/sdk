import { SDKCore } from "../core.js";
import { RequestOptions } from "../lib/sdks.js";
import { ConnectionError, InvalidRequestError, RequestAbortedError, RequestTimeoutError, UnexpectedClientError } from "../models/errors/http-client-errors.js";
import { ResponseValidationError } from "../models/errors/response-validation-error.js";
import { SDKError } from "../models/errors/sdk-error.js";
import { SDKValidationError } from "../models/errors/sdk-validation-error.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
import { APIPromise } from "../types/async.js";
import { Result } from "../types/fp.js";
/**
 * List memories for an agent wallet.
 */
export declare function memoryList(client: SDKCore, request: operations.ListRequest, options?: RequestOptions): APIPromise<Result<Array<models.GraphMemoryItem>, SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=memory-list.d.ts.map
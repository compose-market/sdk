import { SDKCore } from "../core.js";
import { RequestOptions } from "../lib/sdks.js";
import { ConnectionError, InvalidRequestError, RequestAbortedError, RequestTimeoutError, UnexpectedClientError } from "../models/errors/http-client-errors.js";
import { ResponseValidationError } from "../models/errors/response-validation-error.js";
import { SDKError } from "../models/errors/sdk-error.js";
import { SDKValidationError } from "../models/errors/sdk-validation-error.js";
import { APIPromise } from "../types/async.js";
import { Result } from "../types/fp.js";
export declare function connectorsOnchainList(client: SDKCore, options?: RequestOptions): APIPromise<Result<{
    [k: string]: any;
}, SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=connectors-onchain-list.d.ts.map
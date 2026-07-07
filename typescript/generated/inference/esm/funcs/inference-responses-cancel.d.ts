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
export declare function inferenceResponsesCancel(client: SDKCore, request: operations.ResponsesCancelRequest, options?: RequestOptions): APIPromise<Result<models.ResponseObject, SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=inference-responses-cancel.d.ts.map
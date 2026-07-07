import { SDKCore } from "../core.js";
import { RequestOptions } from "../lib/sdks.js";
import { ConnectionError, InvalidRequestError, RequestAbortedError, RequestTimeoutError, UnexpectedClientError } from "../models/errors/http-client-errors.js";
import * as errors from "../models/errors/index.js";
import { ResponseValidationError } from "../models/errors/response-validation-error.js";
import { SDKError } from "../models/errors/sdk-error.js";
import { SDKValidationError } from "../models/errors/sdk-validation-error.js";
import * as operations from "../models/operations/index.js";
import { APIPromise } from "../types/async.js";
import { Result } from "../types/fp.js";
export declare function inferenceResponsesCreate(client: SDKCore, security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest & {
    body: {
        stream?: false;
    };
}, options?: RequestOptions): APIPromise<Result<operations.ResponsesCreateResponse, errors.PaymentRequiredResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
export declare function inferenceResponsesCreate(client: SDKCore, security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest & {
    body: {
        stream: true;
    };
}, options?: RequestOptions): APIPromise<Result<operations.ResponsesCreateResponse, errors.PaymentRequiredResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
export declare function inferenceResponsesCreate(client: SDKCore, security: operations.ResponsesCreateSecurity, request: operations.ResponsesCreateRequest, options?: RequestOptions): APIPromise<Result<operations.ResponsesCreateResponse, errors.PaymentRequiredResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=inference-responses-create.d.ts.map
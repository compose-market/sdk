import { SDKCore } from "../core.js";
import { RequestOptions } from "../lib/sdks.js";
import { ConnectionError, InvalidRequestError, RequestAbortedError, RequestTimeoutError, UnexpectedClientError } from "../models/errors/http-client-errors.js";
import * as errors from "../models/errors/index.js";
import { ResponseValidationError } from "../models/errors/response-validation-error.js";
import { SDKError } from "../models/errors/sdk-error.js";
import { SDKValidationError } from "../models/errors/sdk-validation-error.js";
import * as models from "../models/index.js";
import { APIPromise } from "../types/async.js";
import { Result } from "../types/fp.js";
/**
 * Save an explicit durable fact or preference.
 *
 * @remarks
 * Agent-first memory loop step. Call when the agent identifies a durable fact,
 * preference, correction, decision, or operational lesson.
 */
export declare function memoryRemember(client: SDKCore, request: models.AgentMemoryRememberRequest, options?: RequestOptions): APIPromise<Result<models.AgentMemoryRememberResponse, errors.ErrorResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=memory-remember.d.ts.map
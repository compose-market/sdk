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
 * Assemble compact pre-turn memory context.
 *
 * @remarks
 * Agent-first memory loop step. Call before reasoning or tool use. Returns a
 * compact prompt and structured memory items across working, scene, graph,
 * patterns, archives, and vectors.
 */
export declare function memoryContextAssemble(client: SDKCore, request: models.AgentMemoryContextRequest, options?: RequestOptions): APIPromise<Result<models.AgentMemoryContextResponse, errors.ErrorResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=memory-context-assemble.d.ts.map
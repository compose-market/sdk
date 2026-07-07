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
 * Persist the completed turn.
 *
 * @remarks
 * Agent-first memory loop step. Call after the assistant final answer to store
 * transcript, working memory, and vector memory for later retrieval.
 */
export declare function memoryTurnRecord(client: SDKCore, request: models.AgentMemoryRecordTurnRequest, options?: RequestOptions): APIPromise<Result<models.AgentMemoryRecordTurnResponse, errors.ErrorResponse | SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=memory-turn-record.d.ts.map
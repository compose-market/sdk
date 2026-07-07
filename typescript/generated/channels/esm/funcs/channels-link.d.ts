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
 * Create a linking code for a channel
 *
 * @remarks
 * Generates a short-lived linking code that pairs a user's wallet with an agent
 * on the specified channel. The response includes a URL or action that the user
 * must follow to complete the linking process (QR code for WhatsApp, OAuth redirect
 * for Slack/Discord, bot link for Telegram).
 */
export declare function channelsLink(client: SDKCore, request: operations.LinkRequest, options?: RequestOptions): APIPromise<Result<models.ChannelLinkResponse, SDKError | ResponseValidationError | ConnectionError | RequestAbortedError | RequestTimeoutError | InvalidRequestError | UnexpectedClientError | SDKValidationError>>;
//# sourceMappingURL=channels-link.d.ts.map
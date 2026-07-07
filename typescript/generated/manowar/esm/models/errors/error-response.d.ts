import * as z from "zod/v4-mini";
import * as models from "../index.js";
import { SDKError } from "./sdk-error.js";
/**
 * Runtime error response.
 */
export type ErrorResponseData = {
    error?: models.ErrorT | undefined;
    code?: string | undefined;
    message?: string | undefined;
    timestamp?: string | undefined;
    [additionalProperties: string]: unknown;
};
/**
 * Runtime error response.
 */
export declare class ErrorResponse extends SDKError {
    error?: models.ErrorT | undefined;
    code?: string | undefined;
    timestamp?: string | undefined;
    /** The original data that was passed to this error instance. */
    data$: ErrorResponseData;
    constructor(err: ErrorResponseData, httpMeta: {
        response: Response;
        request: Request;
        body: string;
    });
}
/** @internal */
export declare const ErrorResponse$inboundSchema: z.ZodMiniType<ErrorResponse, unknown>;
//# sourceMappingURL=error-response.d.ts.map
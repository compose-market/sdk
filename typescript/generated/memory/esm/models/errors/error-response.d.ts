import * as z from "zod/v4-mini";
import * as models from "../index.js";
import { SDKError } from "./sdk-error.js";
/**
 * Memory error response.
 */
export type ErrorResponseData = {
    error?: models.ErrorT | undefined;
    [additionalProperties: string]: unknown;
};
/**
 * Memory error response.
 */
export declare class ErrorResponse extends SDKError {
    error?: models.ErrorT | undefined;
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
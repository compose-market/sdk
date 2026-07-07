import * as z from "zod/v4-mini";
import { SDKError } from "./sdk-error.js";
export type LegacyErrorData = {
    error?: string | undefined;
    code?: string | undefined;
    message?: string | undefined;
    [additionalProperties: string]: unknown;
};
export declare class LegacyError extends SDKError {
    error?: string | undefined;
    code?: string | undefined;
    /** The original data that was passed to this error instance. */
    data$: LegacyErrorData;
    constructor(err: LegacyErrorData, httpMeta: {
        response: Response;
        request: Request;
        body: string;
    });
}
/** @internal */
export declare const LegacyError$inboundSchema: z.ZodMiniType<LegacyError, unknown>;
//# sourceMappingURL=legacy-error.d.ts.map
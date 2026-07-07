import * as z from "zod/v4-mini";
import * as models from "../index.js";
import { SDKError } from "./sdk-error.js";
export type ErrorEnvelopeData = {
    error: models.ErrorT;
};
export declare class ErrorEnvelope extends SDKError {
    error: models.ErrorT;
    /** The original data that was passed to this error instance. */
    data$: ErrorEnvelopeData;
    constructor(err: ErrorEnvelopeData, httpMeta: {
        response: Response;
        request: Request;
        body: string;
    });
}
/** @internal */
export declare const ErrorEnvelope$inboundSchema: z.ZodMiniType<ErrorEnvelope, unknown>;
//# sourceMappingURL=error-envelope.d.ts.map
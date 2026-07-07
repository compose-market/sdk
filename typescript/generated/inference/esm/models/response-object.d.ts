import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ReceiptBody } from "./receipt-body.js";
export declare const Status: {
    readonly Completed: "completed";
    readonly InProgress: "in_progress";
    readonly Failed: "failed";
    readonly Cancelled: "cancelled";
};
export type Status = OpenEnum<typeof Status>;
export type ResponseObject = {
    id: string;
    object: "response";
    createdAt: number;
    status: Status;
    model: string;
    output: Array<{
        [k: string]: any;
    }>;
    usage?: {
        [k: string]: any;
    } | undefined;
    error?: {
        [k: string]: any;
    } | undefined;
    previousResponseId?: string | undefined;
    jobId?: string | undefined;
    receipt?: ReceiptBody | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const Status$inboundSchema: z.ZodMiniType<Status, unknown>;
/** @internal */
export declare const ResponseObject$inboundSchema: z.ZodMiniType<ResponseObject, unknown>;
export declare function responseObjectFromJSON(jsonString: string): SafeParseResult<ResponseObject, SDKValidationError>;
//# sourceMappingURL=response-object.d.ts.map
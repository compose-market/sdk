import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const Method: {
    readonly Get: "GET";
    readonly Post: "POST";
    readonly Patch: "PATCH";
    readonly Delete: "DELETE";
};
export type Method = OpenEnum<typeof Method>;
export type MemoryLoopStepManifest = {
    operationId: string;
    method: Method;
    path: string;
    purpose: string;
};
/** @internal */
export declare const Method$inboundSchema: z.ZodMiniType<Method, unknown>;
/** @internal */
export declare const MemoryLoopStepManifest$inboundSchema: z.ZodMiniType<MemoryLoopStepManifest, unknown>;
export declare function memoryLoopStepManifestFromJSON(jsonString: string): SafeParseResult<MemoryLoopStepManifest, SDKValidationError>;
//# sourceMappingURL=memory-loop-step-manifest.d.ts.map
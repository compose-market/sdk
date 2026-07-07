import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { SessionMemory } from "./session-memory.js";
export type WorkingSessionUpdateResponse = {
    success: boolean;
    session: SessionMemory;
};
/** @internal */
export declare const WorkingSessionUpdateResponse$inboundSchema: z.ZodMiniType<WorkingSessionUpdateResponse, unknown>;
export declare function workingSessionUpdateResponseFromJSON(jsonString: string): SafeParseResult<WorkingSessionUpdateResponse, SDKValidationError>;
//# sourceMappingURL=working-session-update-response.d.ts.map
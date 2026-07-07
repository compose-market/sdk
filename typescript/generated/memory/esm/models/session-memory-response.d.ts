import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { SessionMemory } from "./session-memory.js";
export type SessionMemoryResponse = {
    session: SessionMemory;
};
/** @internal */
export declare const SessionMemoryResponse$inboundSchema: z.ZodMiniType<SessionMemoryResponse, unknown>;
export declare function sessionMemoryResponseFromJSON(jsonString: string): SafeParseResult<SessionMemoryResponse, SDKValidationError>;
//# sourceMappingURL=session-memory-response.d.ts.map
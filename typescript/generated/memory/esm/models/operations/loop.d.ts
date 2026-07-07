import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
import * as models from "../index.js";
/**
 * Agent memory loop response.
 */
export type LoopResponse = models.AgentMemoryContextResponse | models.AgentMemoryRecordTurnResponse | models.AgentMemoryRememberResponse;
/** @internal */
export declare const LoopResponse$inboundSchema: z.ZodMiniType<LoopResponse, unknown>;
export declare function loopResponseFromJSON(jsonString: string): SafeParseResult<LoopResponse, SDKValidationError>;
//# sourceMappingURL=loop.d.ts.map
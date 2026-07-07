import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ProceduralPattern } from "./procedural-pattern.js";
export type ProceduralPatternListResponse = {
    patterns: Array<ProceduralPattern>;
};
/** @internal */
export declare const ProceduralPatternListResponse$inboundSchema: z.ZodMiniType<ProceduralPatternListResponse, unknown>;
export declare function proceduralPatternListResponseFromJSON(jsonString: string): SafeParseResult<ProceduralPatternListResponse, SDKValidationError>;
//# sourceMappingURL=procedural-pattern-list-response.d.ts.map
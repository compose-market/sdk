import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { ProceduralPattern } from "./procedural-pattern.js";
export type ProceduralPatternResponse = {
    pattern: ProceduralPattern;
};
/** @internal */
export declare const ProceduralPatternResponse$inboundSchema: z.ZodMiniType<ProceduralPatternResponse, unknown>;
export declare function proceduralPatternResponseFromJSON(jsonString: string): SafeParseResult<ProceduralPatternResponse, SDKValidationError>;
//# sourceMappingURL=procedural-pattern-response.d.ts.map
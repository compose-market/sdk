import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
import { MemoryLoopStepManifest } from "./memory-loop-step-manifest.js";
export declare const Loop: {
    readonly Hot: "hot";
    readonly Durable: "durable";
    readonly Maintenance: "maintenance";
};
export type Loop = OpenEnum<typeof Loop>;
export declare const TokenPolicy: {
    readonly ReturnsCompactPromptOnly: "returns compact prompt only";
    readonly ReturnsMetadataOnly: "returns metadata only";
};
export type TokenPolicy = OpenEnum<typeof TokenPolicy>;
export type MemoryLoopManifest = {
    id: string;
    version: "compose.agent_memory_loop.v1";
    description: string;
    loop: Loop;
    tokenPolicy: TokenPolicy;
    steps: Array<MemoryLoopStepManifest>;
};
/** @internal */
export declare const Loop$inboundSchema: z.ZodMiniType<Loop, unknown>;
/** @internal */
export declare const TokenPolicy$inboundSchema: z.ZodMiniType<TokenPolicy, unknown>;
/** @internal */
export declare const MemoryLoopManifest$inboundSchema: z.ZodMiniType<MemoryLoopManifest, unknown>;
export declare function memoryLoopManifestFromJSON(jsonString: string): SafeParseResult<MemoryLoopManifest, SDKValidationError>;
//# sourceMappingURL=memory-loop-manifest.d.ts.map
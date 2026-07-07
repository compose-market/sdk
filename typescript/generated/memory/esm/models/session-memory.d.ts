import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export declare const SessionMemoryScope: {
    readonly Global: "global";
    readonly Local: "local";
};
export type SessionMemoryScope = OpenEnum<typeof SessionMemoryScope>;
export type WorkingMemory = {
    context: Array<string>;
    entities: {
        [k: string]: any;
    };
    state: {
        [k: string]: any;
    };
};
export type SessionMemory = {
    sessionId: string;
    agentWallet: string;
    userAddress?: string | undefined;
    threadId?: string | undefined;
    scope?: SessionMemoryScope | undefined;
    haiId?: string | undefined;
    workingMemory: WorkingMemory;
    metadata?: {
        [k: string]: any;
    } | undefined;
    compressed: boolean;
    createdAt: number;
    expiresAt: number;
    lastAccessedAt: number;
};
/** @internal */
export declare const SessionMemoryScope$inboundSchema: z.ZodMiniType<SessionMemoryScope, unknown>;
/** @internal */
export declare const WorkingMemory$inboundSchema: z.ZodMiniType<WorkingMemory, unknown>;
export declare function workingMemoryFromJSON(jsonString: string): SafeParseResult<WorkingMemory, SDKValidationError>;
/** @internal */
export declare const SessionMemory$inboundSchema: z.ZodMiniType<SessionMemory, unknown>;
export declare function sessionMemoryFromJSON(jsonString: string): SafeParseResult<SessionMemory, SDKValidationError>;
//# sourceMappingURL=session-memory.d.ts.map
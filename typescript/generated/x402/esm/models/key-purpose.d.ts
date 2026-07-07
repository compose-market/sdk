import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const KeyPurpose: {
    readonly Session: "session";
    readonly Api: "api";
};
export type KeyPurpose = OpenEnum<typeof KeyPurpose>;
/** @internal */
export declare const KeyPurpose$inboundSchema: z.ZodMiniType<KeyPurpose, unknown>;
/** @internal */
export declare const KeyPurpose$outboundSchema: z.ZodMiniType<string, KeyPurpose>;
//# sourceMappingURL=key-purpose.d.ts.map
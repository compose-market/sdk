import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
export declare const SessionActiveHeader: {
    readonly True: "true";
    readonly False: "false";
};
export type SessionActiveHeader = ClosedEnum<typeof SessionActiveHeader>;
/** @internal */
export declare const SessionActiveHeader$outboundSchema: z.ZodMiniEnum<typeof SessionActiveHeader>;
//# sourceMappingURL=session-active-header.d.ts.map
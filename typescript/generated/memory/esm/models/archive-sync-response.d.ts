import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../types/fp.js";
import { SDKValidationError } from "./errors/sdk-validation-error.js";
export type ArchiveSyncResponse = {
    ipfsHash: string;
    pinned: boolean;
};
/** @internal */
export declare const ArchiveSyncResponse$inboundSchema: z.ZodMiniType<ArchiveSyncResponse, unknown>;
export declare function archiveSyncResponseFromJSON(jsonString: string): SafeParseResult<ArchiveSyncResponse, SDKValidationError>;
//# sourceMappingURL=archive-sync-response.d.ts.map
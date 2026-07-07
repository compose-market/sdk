import * as z from "zod/v4-mini";
import { Result as SafeParseResult } from "../../types/fp.js";
import { SDKValidationError } from "../errors/sdk-validation-error.js";
/**
 * Slack app manifest JSON
 */
export type SlackManifestResponse = {};
/** @internal */
export declare const SlackManifestResponse$inboundSchema: z.ZodMiniType<SlackManifestResponse, unknown>;
export declare function slackManifestResponseFromJSON(jsonString: string): SafeParseResult<SlackManifestResponse, SDKValidationError>;
//# sourceMappingURL=slack-manifest.d.ts.map
import * as z from "zod/v4-mini";
import { ClosedEnum } from "../types/enums.js";
import { AttachmentInput, AttachmentInput$Outbound } from "./attachment-input.js";
import { ReasoningOptions, ReasoningOptions$Outbound } from "./reasoning-options.js";
import { ResponseFormat, ResponseFormat$Outbound } from "./response-format.js";
import { StreamOptions, StreamOptions$Outbound } from "./stream-options.js";
export declare const Modality: {
    readonly Text: "text";
    readonly Image: "image";
    readonly Audio: "audio";
    readonly Video: "video";
    readonly Embedding: "embedding";
};
export type Modality = ClosedEnum<typeof Modality>;
export type ResponsesCreateRequest = {
    model: string;
    input: any;
    attachments?: Array<AttachmentInput> | undefined;
    stream?: boolean | undefined;
    modalities?: Array<Modality> | undefined;
    instructions?: string | undefined;
    previousResponseId?: string | undefined;
    maxOutputTokens?: number | undefined;
    temperature?: number | undefined;
    tools?: Array<{
        [k: string]: any;
    }> | undefined;
    toolChoice?: any | undefined;
    responseFormat?: ResponseFormat | undefined;
    streamOptions?: StreamOptions | undefined;
    parallelToolCalls?: boolean | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    serviceTier?: string | undefined;
    store?: boolean | undefined;
    reasoningEffort?: string | undefined;
    reasoning?: ReasoningOptions | undefined;
    include?: Array<string> | undefined;
    promptCacheKey?: string | undefined;
    promptCacheRetention?: string | undefined;
    text?: {
        [k: string]: any;
    } | undefined;
    n?: number | undefined;
    size?: string | undefined;
    quality?: string | undefined;
    imageUrl?: string | undefined;
    voice?: string | undefined;
    language?: string | undefined;
    speed?: number | undefined;
    duration?: number | undefined;
    aspectRatio?: string | undefined;
    resolution?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const Modality$outboundSchema: z.ZodMiniEnum<typeof Modality>;
/** @internal */
export type ResponsesCreateRequest$Outbound = {
    model: string;
    input: any;
    attachments?: Array<AttachmentInput$Outbound> | undefined;
    stream?: boolean | undefined;
    modalities?: Array<string> | undefined;
    instructions?: string | undefined;
    previous_response_id?: string | undefined;
    max_output_tokens?: number | undefined;
    temperature?: number | undefined;
    tools?: Array<{
        [k: string]: any;
    }> | undefined;
    tool_choice?: any | undefined;
    response_format?: ResponseFormat$Outbound | undefined;
    stream_options?: StreamOptions$Outbound | undefined;
    parallel_tool_calls?: boolean | undefined;
    metadata?: {
        [k: string]: any;
    } | undefined;
    service_tier?: string | undefined;
    store?: boolean | undefined;
    reasoning_effort?: string | undefined;
    reasoning?: ReasoningOptions$Outbound | undefined;
    include?: Array<string> | undefined;
    prompt_cache_key?: string | undefined;
    prompt_cache_retention?: string | undefined;
    text?: {
        [k: string]: any;
    } | undefined;
    n?: number | undefined;
    size?: string | undefined;
    quality?: string | undefined;
    image_url?: string | undefined;
    voice?: string | undefined;
    language?: string | undefined;
    speed?: number | undefined;
    duration?: number | undefined;
    aspect_ratio?: string | undefined;
    resolution?: string | undefined;
    [additionalProperties: string]: unknown;
};
/** @internal */
export declare const ResponsesCreateRequest$outboundSchema: z.ZodMiniType<ResponsesCreateRequest$Outbound, ResponsesCreateRequest>;
export declare function responsesCreateRequestToJSON(responsesCreateRequest: ResponsesCreateRequest): string;
//# sourceMappingURL=responses-create-request.d.ts.map
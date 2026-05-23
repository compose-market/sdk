/**
 * Canonical Compose Market API types.
 *
 * These types are the public wire contract between the Compose backend
 * (`api.compose.market`) and the SDK. They mirror the OpenAPI sources under
 * `packages/sdk/specs`; if a mismatch is ever observed, the server contract is
 * authoritative and this file is the one that needs updating.
 */

// =============================================================================
// Error envelope
// =============================================================================

export type ComposeErrorCode =
    | "validation_error"
    | "authentication_required"
    | "authentication_failed"
    | "forbidden"
    | "not_found"
    | "conflict"
    | "rate_limited"
    | "payment_required"
    | "insufficient_balance"
    | "insufficient_allowance"
    | "budget_exhausted"
    | "key_revoked"
    | "key_expired"
    | "key_not_found"
    | "chain_not_supported"
    | "model_not_found"
    | "model_ambiguous"
    | "provider_unavailable"
    | "upstream_timeout"
    | "upstream_error"
    | "internal_error"
    | "idempotency_conflict"
    | "idempotency_in_flight"
    | "settlement_failed"
    | "session_invalid"
    | "network_error"
    | "timeout";

export interface ComposeErrorEnvelope {
    error: {
        code: ComposeErrorCode;
        message: string;
        details?: Record<string, unknown>;
    };
}

// =============================================================================
// x402 PaymentRequired / PaymentPayload
// =============================================================================

export interface PaymentRequirements {
    scheme: string;
    network: string;
    amount: string;
    asset: string;
    payTo: string;
    maxTimeoutSeconds: number;
    extra?: Record<string, unknown> | null;
}

export interface PaymentRequired {
    x402Version: 2;
    error?: string;
    resource: {
        url: string;
        description?: string;
        mimeType?: string;
    };
    accepts: PaymentRequirements[];
    extensions?: Record<string, unknown> | null;
}

export interface PaymentPayload {
    x402Version: 2;
    accepted: PaymentRequirements;
    payload: unknown;
    resource?: PaymentRequired["resource"];
    extensions?: Record<string, unknown> | null;
}

export type X402PaymentSignature = string | PaymentPayload;

export interface X402PaymentRequest {
    paymentRequired: PaymentRequired;
    paymentRequiredHeader: string | null;
    method: string;
    path: string;
    url: string;
    body?: unknown;
    userAddress?: string | null;
    chainId?: number | null;
    maxAmountWei?: string;
}

export type X402PaymentSigner = (request: X402PaymentRequest) => X402PaymentSignature | Promise<X402PaymentSignature>;

export type ComposePaymentMode = "auto" | "composeKey" | "x402";

export interface SettleResponse {
    success: boolean;
    errorReason?: string;
    errorMessage?: string;
    payer?: string;
    transaction?: string;
    network?: string;
    amount?: string;
}

export interface VerifyResponse {
    isValid: boolean;
    invalidReason?: string;
    invalidMessage?: string;
    payer?: string;
}

export interface FacilitatorSupportedResponse {
    kinds: Array<{
        x402Version: number;
        scheme: string;
        network: string;
        extra?: Record<string, unknown>;
    }>;
    extensions: string[];
    signers?: Record<string, string[]>;
}

export interface FacilitatorChain {
    chainId: number;
    name: string;
    network: `eip155:${number}`;
    shortName?: string;
    isTestnet: boolean;
    explorer?: string;
    usdcAddress: `0x${string}`;
    schemes: readonly ("exact" | "upto")[];
    asset: "USDC";
    decimals: 6;
}

export interface FacilitatorChainsResponse {
    chains: FacilitatorChain[];
    defaultChainId: number;
}

// =============================================================================
// x402 payment intents / metering
// =============================================================================

export type PaymentIntentStatus = "authorized" | "settling" | "settled" | "aborted" | "failed";

export interface MeterLineItem {
    key: string;
    unit: string;
    quantity: number;
    unitPriceUsd: number;
}

export interface MeteredInput {
    subject: string;
    lineItems: MeterLineItem[];
}

export interface MeteredQuotedLineItem extends MeterLineItem {
    amountWei: string;
}

export interface MeteredQuote {
    subject: string;
    lineItems: MeteredQuotedLineItem[];
    providerAmountWei: string;
    platformFeeWei: string;
    finalAmountWei: string;
}

export interface ModelMeterQuote extends MeteredQuote {
    modelId: string;
    provider: ModelProvider;
    known: boolean;
    meter: MeteredInput;
}

export interface PaymentPrepareInput {
    service: string;
    action: string;
    resource: string;
    method: string;
    maxAmountWei?: string;
    meter?: MeteredInput;
    composeRunId?: string;
    idempotencyKey?: string;
}

export interface PaymentPrepareResponse {
    paymentIntentId: string;
    maxAmountWei: string;
    status: PaymentIntentStatus;
    [key: string]: unknown;
}

export interface PaymentSettleInput {
    paymentIntentId: string;
    finalAmountWei?: string;
    meter?: MeteredInput;
}

export interface PaymentSettleResponse {
    paymentIntentId: string;
    maxAmountWei: string;
    finalAmountWei: string;
    status: PaymentIntentStatus;
    meterSubject?: string;
    lineItems?: MeteredQuotedLineItem[];
    providerAmountWei?: string;
    platformFeeWei?: string;
    txHash?: string;
    [key: string]: unknown;
}

export interface PaymentAbortInput {
    paymentIntentId: string;
    reason?: string;
}

export interface PaymentAbortResponse {
    success?: boolean;
    paymentIntentId: string;
    status?: PaymentIntentStatus;
    reason?: string;
    [key: string]: unknown;
}

export interface ModelMeterInput {
    modelId: string;
    provider?: ModelProvider | string;
    modality: CanonicalModality | string;
    usage?: Record<string, unknown>;
    media?: Record<string, unknown>;
}

// =============================================================================
// Feedback / Reputation
// =============================================================================

export type FeedbackTargetType = "endpoint" | "x402" | "model" | "agent" | "workflow";

export type FeedbackCategory =
    | "general"
    | "bug"
    | "latency"
    | "quality"
    | "pricing"
    | "settlement"
    | "model_capability"
    | "safety"
    | "docs"
    | "integration";

export type FeedbackVerificationKind = "anonymous" | "wallet_header" | "compose_key";

export interface FeedbackTarget {
    type: FeedbackTargetType;
    id: string;
}

export interface FeedbackContext {
    requestId?: string;
    paymentIntentId?: string;
    composeRunId?: string;
    chainId?: number;
    modelId?: string;
    provider?: string;
    agentWallet?: string;
    workflowId?: string;
    endpoint?: {
        method?: string;
        path?: string;
        url?: string;
    };
    receipt?: {
        network?: string;
        txHash?: string;
        finalAmountWei?: string;
    };
    sdk?: {
        name?: string;
        version?: string;
    };
}

export interface FeedbackSubmitInput {
    target: FeedbackTarget;
    category?: FeedbackCategory;
    rating?: number;
    message?: string;
    labels?: string[];
    context?: FeedbackContext;
    metadata?: Record<string, unknown>;
}

export interface FeedbackSubmitResponse {
    feedbackId: string;
    target: FeedbackTarget;
    verification: FeedbackVerificationKind;
    createdAt: number;
}

export interface FeedbackRecord {
    id: string;
    target: FeedbackTarget;
    category: FeedbackCategory;
    rating?: number;
    message?: string;
    labels: string[];
    context: FeedbackContext;
    metadata: Record<string, unknown>;
    verification: FeedbackVerificationKind;
    createdAt: number;
}

export interface FeedbackListResponse {
    object: "list";
    data: FeedbackRecord[];
}

export interface FeedbackSummary {
    target: FeedbackTarget;
    count: number;
    ratingCount: number;
    ratingAverage: number | null;
    ratings: Record<"1" | "2" | "3" | "4" | "5", number>;
    categories: Record<FeedbackCategory, number>;
    verification: Record<FeedbackVerificationKind, number>;
    recent: FeedbackRecord[];
}

// =============================================================================
// Compose Keys
// =============================================================================

export type ComposeKeyPurpose = "session" | "api";

export interface ComposeKeyCreateResponse {
    keyId: string;
    token: string;
    purpose: ComposeKeyPurpose;
    budgetLimit: string;
    budgetUsed: string;
    budgetRemaining: string;
    createdAt: number;
    expiresAt: number;
    chainId: number;
    name?: string;
}

export interface ComposeKeyRecord {
    keyId: string;
    purpose: ComposeKeyPurpose;
    budgetLimit: string;
    budgetUsed: string;
    budgetReserved?: string;
    budgetRemaining: string;
    createdAt: number;
    expiresAt: number;
    revokedAt?: number;
    lastUsedAt?: number;
    name?: string;
    chainId?: number;
}

export interface ActiveSessionMetadata {
    hasSession: boolean;
    reason?: string;
    keyId?: string;
    token?: string;
    budgetLimit?: string;
    budgetUsed?: string;
    budgetLocked?: string;
    budgetRemaining?: string;
    expiresAt?: number;
    chainId?: number;
    name?: string;
    status?: {
        isActive: boolean;
        isExpired: boolean;
        expiresInSeconds: number;
        budgetPercentRemaining: number;
        warnings: {
            budgetDepleted: boolean;
            budgetLow: boolean;
            expiringSoon: boolean;
            expired: boolean;
        };
    };
}

// =============================================================================
// Session-budget headers & live events
// =============================================================================

/**
 * Live session-budget snapshot parsed from `x-session-budget-*` response
 * headers. Every billable response carries these; the SDK surfaces them as
 * part of `ComposeCompletion<T>` and as a typed `budget` event on the event
 * bus so UIs can update the session indicator without polling `/api/session`.
 */
export interface SessionBudgetSnapshot {
    limitWei: string | null;
    usedWei: string | null;
    lockedWei: string | null;
    remainingWei: string | null;
}

export type SessionInvalidReason =
    | "budget-depleted"
    | "expired"
    | "revoked"
    | "chain-mismatch"
    | (string & { readonly __brand?: "SessionInvalidReason" });

/**
 * SSE-frame payload for `/api/session/events`. The server emits two named
 * events: `session-active` (live ledger heartbeat while the session is
 * healthy) and `session-expired` (terminal notification when the session has
 * been revoked, expired, or run out of budget).
 */
export interface SessionActiveEvent {
    type: "session-active";
    userAddress: string;
    chainId: number;
    expiresAt?: number;
    budgetLimit?: string;
    budgetUsed?: string;
    budgetLocked?: string;
    budgetRemaining?: string;
    timestamp?: number;
}

export interface SessionExpiredEvent {
    type: "session-expired";
    userAddress: string;
    chainId: number;
    reason?: SessionInvalidReason;
    message?: string;
    action?: string;
    expiresAt?: number;
    timestamp?: number;
}

export type SessionEvent = SessionActiveEvent | SessionExpiredEvent;

// =============================================================================
// Receipts
// =============================================================================

export interface ComposeReceiptLineItem {
    key: string;
    unit: string;
    quantity: number;
    unitPriceUsd: number;
    amountWei: string;
}

export interface ComposeReceipt {
    subject?: string;
    lineItems?: ComposeReceiptLineItem[];
    providerAmountWei?: string;
    platformFeeWei?: string;
    finalAmountWei: string;
    txHash?: string;
    network: `eip155:${number}`;
    settledAt: number;
}

// =============================================================================
// Models
// =============================================================================

export type ModelProvider =
    | "gemini"
    | "openai"
    | "fireworks"
    | "asicloud"
    | "alibaba"
    | "hugging face"
    | "azure"
    | "aiml"
    | "vertex"
    | "cloudflare"
    | "deepgram"
    | "elevenlabs"
    | "cartesia"
    | "roboflow";

export type CanonicalModality = "text" | "image" | "audio" | "video" | "embedding";

export interface PricingUnit {
    unitKey: string;
    unit?: string;
    header?: string;
    entries: Record<string, number>;
    valueKeys: string[];
    default?: boolean;
}

export interface ModelOperationCapability {
    modality: CanonicalModality;
    operation: string;
    sourceTypes: string[];
    input: string[];
    output: string[];
    pricingUnits: PricingUnit[];
    streamable: boolean;
}

export interface OperationCatalogEntry {
    operation: string;
    modelCount: number;
    sourceTypes: string[];
    pricingUnits: PricingUnit[];
}

export interface ModalityCatalogEntry {
    modality: CanonicalModality;
    operations: OperationCatalogEntry[];
    modelCount: number;
    pricingUnits: PricingUnit[];
}

export interface ModalityListResponse {
    object: "list";
    data: ModalityCatalogEntry[];
}

export interface OperationListResponse {
    object: "list";
    data: OperationCatalogEntry[];
}

/**
 * Canonical Compose model card. This is exactly what `/v1/models`,
 * `/v1/models/all`, `/v1/models/search`, and `/v1/models/:id` return — one
 * entry per row, no wrapper, no translation layer.
 */
export interface Model {
    modelId: string;
    upstreamModelId?: string;
    name: string | null;
    provider: ModelProvider;
    type: string | string[] | null;
    description: string | null;
    input: unknown;
    output: unknown;
    contextWindow: unknown;
    pricing: unknown;
    maxOutputTokens?: number;
    capabilities?: unknown;
    modelType?: unknown;
    sourceMetadata?: unknown;
    params?: unknown;
    ownedBy?: string;
    createdAt?: string | number;
    available?: boolean;
    availableFrom?: ModelProvider[];
    hfInferenceProvider?: string;
    hfProviderId?: string;
}

export interface ModelListResponse {
    object: "list";
    data: Model[];
}

export interface ModelSearchInput {
    q?: string;
    modality?: CanonicalModality;
    operation?: string;
    provider?: ModelProvider;
    priceMaxPerMTok?: number;
    contextWindowMin?: number;
    streaming?: boolean;
    cursor?: string | null;
    limit?: number;
}

export interface ModelSearchResponse {
    object: "list";
    data: Model[];
    total: number;
    next_cursor: string | null;
}

export type OperationModel = Model & {
    operations: ModelOperationCapability[];
};

export interface OperationModelsInput {
    q?: string;
    provider?: ModelProvider;
    streaming?: boolean;
    cursor?: string | null;
    limit?: number;
}

export interface OperationModelsResponse {
    object: "list";
    data: OperationModel[];
    total: number;
    next_cursor: string | null;
}

export interface ModelParamDefinition {
    type: "string" | "integer" | "number" | "boolean" | "array" | "object";
    required: boolean;
    default?: string | number | boolean;
    options?: Array<string | number>;
    minimum?: number;
    maximum?: number;
    description?: string;
}

export interface ModelParamsResponse {
    modelId: string;
    type: CanonicalModality | null;
    provider: string | null;
    params: Record<string, ModelParamDefinition>;
    defaults: Record<string, unknown>;
}

export interface PricingModel {
    modelId: string;
    provider: ModelProvider | string;
    pricing: unknown;
}

export interface PricingResponse {
    models: PricingModel[];
    version: string;
}

// =============================================================================
// System / Health
// =============================================================================

export interface HealthResponse {
    status: "ok" | string;
    timestamp?: string;
    [key: string]: unknown;
}

export interface RuntimeFramework {
    id?: string;
    name?: string;
    description?: string;
    version?: string;
    [key: string]: unknown;
}

export interface FrameworksResponse {
    frameworks: RuntimeFramework[];
}

// =============================================================================
// Inference — Chat Completions
// =============================================================================

export type ChatRole = "system" | "developer" | "user" | "assistant" | "tool";

export type ComposeAttachmentKind =
    | "image"
    | "audio"
    | "video"
    | "pdf"
    | "file"
    | "text"
    | "json"
    | "url";

export interface ComposeAttachment {
    type?: ComposeAttachmentKind | (string & { readonly __brand?: "ComposeAttachmentKind" });
    url?: string;
    uri?: string;
    data?: string;
    base64?: string;
    mimeType?: string;
    mime_type?: string;
    contentType?: string;
    content_type?: string;
    name?: string;
    filename?: string;
    text?: string;
    content?: string;
    detail?: "auto" | "low" | "high";
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}

export type ComposeAttachmentInput = ComposeAttachment | string;

export interface ChatMessageTextPart {
    type: "text";
    text: string;
}

export interface ChatMessageImagePart {
    type: "image_url";
    image_url: { url: string; detail?: "auto" | "low" | "high" } | string;
}

export interface ChatMessageAudioPart {
    type: "input_audio";
    input_audio: { url: string } | string;
}

export interface ChatMessageVideoPart {
    type: "video_url";
    video_url: { url: string } | string;
}

export type ChatMessageContentPart =
    | ChatMessageTextPart
    | ChatMessageImagePart
    | ChatMessageAudioPart
    | ChatMessageVideoPart;

export interface ChatMessage {
    role: ChatRole;
    content: string | ChatMessageContentPart[] | null;
    name?: string;
    tool_call_id?: string;
    tool_calls?: Array<{
        id: string;
        type: "function";
        function: { name: string; arguments: string };
    }>;
}

export interface ChatToolDefinition {
    type: "function";
    function: {
        name: string;
        description?: string;
        parameters?: Record<string, unknown>;
        strict?: boolean;
    };
}

export type ChatToolChoice =
    | "none"
    | "auto"
    | "required"
    | { type: "function"; function: { name: string } };

export interface ResponseFormat {
    type: "text" | "json_object" | "json_schema";
    json_schema?: {
        name?: string;
        schema?: Record<string, unknown>;
        strict?: boolean;
        [key: string]: unknown;
    };
    [key: string]: unknown;
}

export interface StreamOptions {
    include_usage?: boolean;
    include_obfuscation?: boolean;
    [key: string]: unknown;
}

export interface ReasoningOptions {
    effort?: string;
    summary?: string;
    [key: string]: unknown;
}

export interface OpenAIPassthroughParams {
    frequency_penalty?: number;
    include?: string[];
    logit_bias?: Record<string, number>;
    metadata?: Record<string, unknown>;
    parallel_tool_calls?: boolean;
    presence_penalty?: number;
    prompt_cache_key?: string;
    promptCacheKey?: string;
    prompt_cache_retention?: string;
    promptCacheRetention?: string;
    reasoning?: ReasoningOptions;
    reasoning_effort?: string;
    reasoningEffort?: string;
    response_format?: ResponseFormat;
    seed?: number;
    service_tier?: string;
    store?: boolean;
    stream_options?: StreamOptions;
    text?: Record<string, unknown>;
    textVerbosity?: string;
    top_p?: number;
    user?: string;
    verbosity?: string;
    custom_params?: Record<string, unknown>;
}

export interface ChatCompletionsCreateParams extends OpenAIPassthroughParams {
    model: string;
    messages: ChatMessage[];
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    stream?: boolean;
    temperature?: number;
    n?: number;
    stop?: string | string[];
    max_tokens?: number;
    max_completion_tokens?: number;
    tools?: ChatToolDefinition[];
    tool_choice?: ChatToolChoice;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface ChatUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    reasoning_tokens?: number;
    cached_input_tokens?: number;
}

export interface ChatCompletion {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: {
            role: "assistant";
            content: string | null;
            reasoning_content?: string;
            tool_calls?: Array<{
                id: string;
                type: "function";
                function: { name: string; arguments: string };
            }>;
        };
        finish_reason: string;
    }>;
    usage: ChatUsage;
    compose_receipt?: Record<string, unknown>;
}

export interface ChatCompletionChunk {
    id: string;
    object: "chat.completion.chunk";
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            role?: "assistant";
            content?: string;
            reasoning_content?: string;
            tool_calls?: Array<{
                index: number;
                id?: string;
                type?: "function";
                function?: { name?: string; arguments?: string };
            }>;
        };
        finish_reason: string | null;
    }>;
    usage?: ChatUsage;
}

// =============================================================================
// Inference — Responses API
// =============================================================================

export interface ResponsesCreateParams extends OpenAIPassthroughParams {
    model: string;
    input: unknown;
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    modalities?: Array<"text" | "image" | "audio" | "video" | "embedding">;
    stream?: boolean;
    instructions?: string;
    previous_response_id?: string;
    max_output_tokens?: number;
    temperature?: number;
    tools?: ChatToolDefinition[];
    tool_choice?: ChatToolChoice;
    n?: number;
    size?: string;
    quality?: string;
    image_url?: string;
    voice?: string;
    language?: string;
    speed?: number;
    duration?: number;
    aspect_ratio?: string;
    resolution?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface ResponseObject {
    id: string;
    object: "response";
    created_at: number;
    status: "completed" | "in_progress" | "failed" | "cancelled";
    model: string;
    output: Array<Record<string, unknown>>;
    usage?: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
    error?: { message: string; type?: string; code?: string };
    previous_response_id?: string;
    job_id?: string;
    compose_receipt?: Record<string, unknown>;
}

export type ResponseStreamEvent =
    | { type: "response.output_text.delta"; response_id: string; model: string; delta: string }
    | { type: "response.reasoning.delta"; response_id: string; model: string; delta: string }
    | { type: "response.tool_call"; response_id: string; model: string; tool_call: { id: string; name: string; arguments: string } }
    | { type: "response.tool_call.delta"; response_id: string; model: string; index: number; delta: { id?: string; name?: string; arguments?: string } }
    | { type: "response.image_generation_call.partial_image"; response_id: string; model: string; partial_image_index: number; partial_image_b64: string }
    | { type: "response.image_generation_call.completed"; response_id: string; model: string; image_b64: string; mime_type?: string; revised_prompt?: string; usage?: { input_tokens: number; output_tokens: number; total_tokens: number } }
    | { type: "response.completed"; response_id: string; model: string; finish_reason: string; usage?: { input_tokens: number; output_tokens: number; total_tokens: number } };

// =============================================================================
// Inference — Embeddings / Images / Audio / Video
// =============================================================================

export interface EmbeddingsCreateParams {
    model: string;
    input: string | string[];
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    dimensions?: number;
    encoding_format?: "float" | "base64" | string;
    user?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface EmbeddingsResponse {
    object: "list";
    data: Array<{
        object: "embedding";
        embedding: number[];
        index: number;
    }>;
    model: string;
    usage: { prompt_tokens: number; total_tokens: number };
    compose_receipt?: Record<string, unknown>;
}

export interface ImagesGenerateParams {
    model: string;
    prompt: string;
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    n?: number;
    size?: string;
    quality?: string;
    response_format?: "url" | "b64_json" | string;
    style?: "vivid" | "natural" | string;
    user?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface ImagesEditParams extends ImagesGenerateParams {
    image?: string;
    mask?: string;
}

export interface ImagesResponse {
    created: number;
    data: Array<{ url?: string; b64_json?: string; revised_prompt?: string }>;
    compose_receipt?: Record<string, unknown>;
}

export interface AudioSpeechCreateParams {
    model: string;
    input: string;
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    voice?: string;
    response_format?: string;
    speed?: number;
    user?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface AudioTranscriptionCreateParams {
    model: string;
    file: string | Blob | File | Uint8Array;
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    filename?: string;
    language?: string;
    response_format?: string;
    prompt?: string;
    temperature?: number;
    timestamp_granularities?: Array<"word" | "segment" | string>;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface AudioTranscriptionResponse {
    text: string;
    task?: string;
    language?: string;
    duration?: number;
    words?: Array<{ word: string; start: number; end: number }>;
    segments?: Array<Record<string, unknown>>;
    compose_receipt?: Record<string, unknown>;
}

export interface VideoGenerateParams {
    model: string;
    prompt?: string;
    attachments?: ComposeAttachmentInput[];
    attachment?: ComposeAttachmentInput;
    duration?: number;
    aspect_ratio?: string;
    resolution?: string;
    size?: string;
    fps?: number;
    image?: string;
    image_url?: string;
    user?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface VideoGenerateResponse {
    id?: string;
    object?: "video.generation";
    status?: string;
    created?: number;
    model?: string;
    job_id?: string;
    data?: Array<{ url?: string; b64_json?: string; base64?: string; duration?: number; [key: string]: unknown }>;
    compose_receipt?: Record<string, unknown>;
    [key: string]: unknown;
}

export interface VideoJobStatus {
    id: string;
    object: "video.generation";
    status: "queued" | "processing" | "completed" | "failed";
    url?: string;
    error?: string;
    progress?: number;
}

export type VideoStatusStreamEvent =
    | { type: "compose.video.status"; jobId: string; status: "queued" | "processing" | "completed" | "failed"; progress?: number; url?: string; error?: string }
    | { type: "compose.error"; code: string; message: string; details?: Record<string, unknown> }
    | { type: "done" };

// =============================================================================
// Agent + Workflow runtime streams
// =============================================================================

/**
 * Events emitted by the Compose agent runtime on /agent/:wallet/stream.
 * Mirrors the runtime's native SSE vocabulary — no translation, no renaming.
 */
export type AgentRuntimeEvent =
    | { type: "text-delta"; delta: string }
    | { type: "reasoning-delta"; delta: string }
    | { type: "tool-args-delta"; id?: string; toolName?: string; argsDelta: string }
    | { type: "thinking-start"; message: string }
    | { type: "thinking-end" }
    | { type: "tool-start"; toolName: string; summary?: string; content?: string }
    | { type: "tool-end"; toolName: string; summary?: string; failed: boolean; error?: string }
    | { type: "stopped"; reason: string }
    | { type: "error"; code?: string; message: string; details?: Record<string, unknown> }
    | { type: "done" };

export interface AgentStreamCreateParams {
    agentWallet: string;
    message: string;
    threadId: string;
    userAddress: string;
    cloudPermissions?: unknown;
    composeRunId?: string;
    attachment?: ComposeAttachmentInput;
    attachments?: ComposeAttachmentInput[];
}

export interface AgentStreamFinalResult {
    text: string;
    toolCalls: Array<{ toolName: string; summary?: string; failed: boolean; error?: string }>;
    requestId: string | null;
    receipt: ComposeReceipt | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

/**
 * Events emitted by the Compose workflow runtime on /workflow/:wallet/chat.
 */
export type WorkflowRuntimeEvent =
    | { type: "start"; message: string; meta?: Record<string, unknown> }
    | { type: "step"; stepName?: string; message: string; meta?: Record<string, unknown> }
    | { type: "agent"; agentName?: string; message: string; meta?: Record<string, unknown> }
    | { type: "progress"; message: string; meta?: Record<string, unknown> }
    | { type: "tool-start"; toolName: string; summary?: string; content?: string }
    | { type: "tool-end"; toolName: string; summary?: string; failed: boolean; error?: string }
    | { type: "result"; output: unknown }
    | { type: "complete"; message: string }
    | { type: "error"; code?: string; message: string }
    | { type: "done" };

export interface WorkflowStreamCreateParams {
    workflowWallet: string;
    message: string;
    threadId: string;
    userAddress: string;
    composeRunId?: string;
    continuous?: boolean;
    lastEventIndex?: number;
    attachment?: ComposeAttachmentInput;
    attachments?: ComposeAttachmentInput[];
}

export interface WorkflowStreamFinalResult {
    text: string;
    structuredOutput: unknown;
    toolCalls: Array<{ toolName: string; summary?: string; failed: boolean; error?: string }>;
    requestId: string | null;
    receipt: ComposeReceipt | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

// =============================================================================
// Local control plane
// =============================================================================

export interface LocalLinkCreateInput {
    userAddress?: string;
    chainId?: number;
    agentWallet?: string;
    agentCardCid?: string;
    deviceId?: string;
}

export interface LocalLinkCreateResponse {
    success: boolean;
    token: string;
    mode: "local-first" | "web-first";
    expiresAt: number;
    deepLinkUrl: string;
    hasSession: boolean;
}

export interface LocalLinkRedeemInput {
    token: string;
    deviceId: string;
    connectedUserAddress?: string;
}

export interface LocalRedeemedContext {
    agentWallet: string;
    userAddress: string;
    chainId: number;
    composeKey: {
        keyId: string;
        token: string;
        expiresAt: number;
    };
    session: {
        sessionId: string;
        budget: string;
        duration: number;
        expiresAt: number;
    };
    market: {
        entry: "local" | string;
        agentWallet: string;
        agentCardCid: string | null;
    };
    deviceId: string;
    hasSession: boolean;
    linkMode: "local-first" | "web-first";
}

export interface LocalLinkRedeemResponse {
    success: boolean;
    context: LocalRedeemedContext;
}

export interface LocalDeploymentRegisterInput {
    agentWallet: string;
    userAddress?: string;
    composeKeyId: string;
    agentCardCid: string;
    localVersion: string;
    deployedAt: number;
    chainId?: number;
}

export interface LocalDeploymentRecord {
    version: number;
    deploymentId: string;
    agentWallet: string;
    userAddress: string;
    composeKeyId: string;
    agentCardCid: string;
    localVersion: string;
    deployedAt: number;
    chainId: number;
    registeredAt: number;
    updatedAt: number;
}

export interface LocalDeploymentRegisterResponse {
    success: boolean;
    idempotent: boolean;
    deployment: LocalDeploymentRecord;
}

export interface LocalPeerSummary {
    peerId: string;
    lastSeenAt: number;
    stale: boolean;
    caps: string[];
    listenMultiaddrs: string[];
    deviceId?: string | null;
    agentWallet?: string | null;
}

export interface LocalNetworkUpsertInput {
    userAddress?: string;
    chainId?: number;
    agentWallet?: string;
    deviceId?: string;
    peers: LocalPeerSummary[];
}

export interface LocalNetworkUpsertResponse {
    success: boolean;
    upserted: number;
    chainId: number;
}

export interface LocalNetworkPeersInput {
    userAddress?: string;
    chainId?: number;
    agentWallet?: string;
}

export interface LocalNetworkPeersResponse {
    success: boolean;
    chainId: number;
    userAddress: string;
    peers: LocalPeerSummary[];
}

export interface LocalSynapseSessionInput {
    agentWallet: string;
    deviceId: string;
    sessionKeyAddress: string;
    sessionKeyExpiresAt: number;
    depositAmount?: string | number;
}

export interface LocalStorageSessionResponse {
    success: boolean;
    agentWallet: string;
    deviceId: string;
    payerAddress: string;
    sessionKeyAddress: string;
    sessionKeyExpiresAt: number;
    availableFunds: string;
    depositAmount: string;
    depositExecuted: boolean;
    network: string;
    source: string;
}

export type LocalSynapseSessionResponse = LocalStorageSessionResponse;

export interface LocalFilecoinPinSessionInput {
    agentWallet: string;
    deviceId: string;
    sessionKeyAddress: string;
    sessionKeyExpiresAt: number;
    fileSizeBytes: number;
    copies?: number;
}

export interface LocalFilecoinPinSessionResponse extends LocalStorageSessionResponse {
    fileSizeBytes: number;
    providerIds: string[];
}

// =============================================================================
// Dispenser
// =============================================================================

export interface DispenserStatus {
    chainId: number;
    chainName: string;
    totalClaims: number;
    maxClaims: number;
    remainingClaims: number;
    dispenserBalance: string;
    dispenserBalanceFormatted: string;
    isPaused: boolean;
    dispenserAddress: string;
    usdcAddress: string;
    isConfigured: boolean;
}

export interface DispenserClaimInput {
    address?: string;
    chainId?: number;
}

export interface DispenserClaimResponse {
    success: boolean;
    txHash?: string;
    alreadyClaimed?: boolean;
    globalClaimStatus?: {
        claimedOnChain?: number;
        claimedOnChainName?: string;
        claimedAt?: number;
    };
    error?: string;
}

export interface DispenserStatusResponse {
    dispensers: DispenserStatus[];
    claimAmount: number;
    claimAmountFormatted: string;
    maxClaims: number;
}

export interface DispenserStatusByChainResponse {
    available: boolean;
    reason?: string;
    status?: DispenserStatus;
}

export interface DispenserCheckResponse {
    address: string;
    hasClaimed: boolean;
    claimedOnChain?: number;
    claimedOnChainName?: string;
    claimedAt?: number;
}

// =============================================================================
// Settlement status
// =============================================================================

export interface SettlementStatusInput {
    userAddress?: string;
    chainId?: number;
}

export interface SettlementBudgetInfo {
    budgetLimit?: string | number;
    budgetUsed?: string | number;
    budgetLocked?: string | number;
    budgetRemaining?: string | number;
    expiresAt?: number;
    chainId?: number;
    [key: string]: unknown;
}

export interface SettlementStatusResponse {
    hasActiveBudget: boolean;
    message?: string;
    budget?: SettlementBudgetInfo;
}

// =============================================================================
// Backpack
// =============================================================================

export type BackpackConsentType =
    | "filesystem"
    | "camera"
    | "microphone"
    | "geolocation"
    | "clipboard"
    | "notifications"
    | string;

export interface BackpackPermission {
    userAddress: string;
    sessionId?: string;
    agentWallet?: string;
    consentType: BackpackConsentType;
    granted: boolean;
    grantedAt: number;
    expiresAt?: number;
}

export interface BackpackPermissionListInput {
    userAddress?: string;
}

export interface BackpackPermissionListResponse {
    permissions: BackpackPermission[];
}

export interface BackpackPermissionGrantInput {
    userAddress?: string;
    consentType: BackpackConsentType;
    sessionId?: string;
    agentWallet?: string;
    expiresAt?: number;
}

export interface BackpackPermissionRevokeInput {
    userAddress?: string;
    consentType: BackpackConsentType;
    sessionId?: string;
    agentWallet?: string;
}

export interface BackpackPermissionWriteResponse {
    success: boolean;
}

export interface BackpackConnectInput {
    userAddress?: string;
    toolkit: string;
}

export interface BackpackConnectResponse {
    redirectUrl?: string;
    url?: string;
    connectedAccountId?: string;
    connectionRequestId?: string;
    [key: string]: unknown;
}

export interface BackpackConnectionsInput {
    userAddress?: string;
}

export interface BackpackConnection {
    slug: string;
    name: string;
    connected: boolean;
    accountId?: string;
    status?: string;
    source?: string;
    sourceLabel?: string;
    bindingId?: string;
}

export interface BackpackConnectionsResponse {
    connections: BackpackConnection[];
}

export interface BackpackStatusInput {
    userAddress?: string;
}

export interface BackpackStatusResponse {
    toolkit: string;
    connected: boolean;
    accountId?: string;
}

export interface BackpackDisconnectInput {
    userAddress?: string;
    toolkit: string;
}

export interface BackpackDisconnectResponse {
    success: boolean;
}

export interface BackpackExecuteInput {
    userAddress?: string;
    toolkit: string;
    action: string;
    params?: Record<string, unknown>;
    text?: string;
}

export interface BackpackExecuteResponse {
    success: boolean;
    result?: unknown;
    error?: string;
}

export interface BackpackToolkitsInput {
    search?: string;
    limit?: number;
}

export interface BackpackToolkit {
    slug: string;
    name: string;
    logo: string;
    description: string;
    categories: string[];
    authSchemes: string[];
    composioManagedSchemes: string[];
}

export interface BackpackToolkitsResponse {
    toolkits: BackpackToolkit[];
}

export interface BackpackToolkitActionsInput {
    limit?: number;
}

export interface BackpackToolkitAction {
    slug: string;
    name: string;
    description: string;
    toolkitSlug: string;
    toolkitName: string;
    noAuth: boolean;
    scopes: string[];
    inputParameters: Record<string, unknown>;
}

export interface BackpackToolkitActionsResponse {
    toolkit: string;
    actions: BackpackToolkitAction[];
}

export interface BackpackTelegramLinkInput {
    userAddress?: string;
}

export interface BackpackTelegramLinkResponse {
    deepLinkUrl: string;
    linkCode: string;
}

export interface BackpackTelegramStatusInput {
    userAddress?: string;
}

export interface BackpackTelegramStatusResponse {
    toolkit: "telegram" | string;
    bound: boolean;
    chatId?: string;
}

// =============================================================================
// Public directory
// =============================================================================

export interface DirectoryAgent {
    schemaVersion: string;
    name: string;
    description: string;
    skills: string[];
    x402Support: boolean;
    image?: string;
    avatar?: string;
    dnaHash: string;
    walletAddress: string;
    walletTimestamp?: number;
    chain: number;
    model: string;
    framework?: "manowar" | string;
    licensePrice: string;
    licenses: number;
    licensesAvailable?: number;
    cloneable: boolean;
    isClone?: boolean;
    parentAgentId?: number;
    agentId?: number;
    knowledge?: string[];
    endpoint?: string;
    protocols: Array<{ name: string; version: string }>;
    plugins?: Array<{
        registryId: string;
        name: string;
        origin: string;
    }>;
    createdAt: string;
    creator?: string;
    cid?: string;
    score?: number;
}

export interface DirectoryWorkflow {
    schemaVersion: string;
    title: string;
    description: string;
    image?: string;
    dnaHash: string;
    walletAddress: string;
    walletTimestamp: number;
    agents: DirectoryAgent[];
    edges?: Array<{
        source: number;
        target: number;
        label?: string;
    }>;
    coordinator?: {
        hasCoordinator: boolean;
        model: string;
    };
    pricing: {
        totalAgentPrice: string;
    };
    lease?: {
        enabled: boolean;
        durationDays: number;
        creatorPercent: number;
    };
    rfa?: {
        title: string;
        description: string;
        skills: string[];
        offerAmount: string;
    };
    creator: string;
    createdAt: string;
    cid?: string;
}

export interface DirectoryAgentListResponse {
    agents: DirectoryAgent[];
    total: number;
}

export interface DirectoryWorkflowListResponse {
    workflows: DirectoryWorkflow[];
    total: number;
}

export interface AgentverseQuery {
    search?: string;
    q?: string;
    category?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
    sort?: "relevancy" | "created-at" | "last-modified" | "interactions";
    direction?: "asc" | "desc";
}

export type AgentverseResponse = Record<string, unknown>;

// =============================================================================
// Agent-first memory loop
// =============================================================================

export type AgentMemoryLayer = "working" | "scene" | "graph" | "patterns" | "archives" | "vectors";
export type AgentMemoryLoopStep = "pre_turn" | "post_turn" | "remember";

export interface AgentMemoryScopeInput {
    agentWallet: string;
    userAddress?: string;
    threadId?: string;
    mode?: "global" | "local";
    haiId?: string;
    filters?: Record<string, unknown>;
    metadata?: Record<string, unknown>;
}

export interface AgentMemoryContextParams extends AgentMemoryScopeInput {
    query: string;
    layers?: AgentMemoryLayer[];
    limit?: number;
    maxItems?: number;
    maxItemChars?: number;
    budget?: {
        maxCharacters?: number;
        max_chars?: number;
        maxContextCharacters?: number;
        max_context_chars?: number;
        mode?: "compact" | "balanced" | "recall";
    };
    includeRaw?: boolean;
}

export interface AgentMemoryTurnMessage {
    role: "user" | "assistant" | "system" | "tool";
    content: string;
    timestamp?: number;
    toolCalls?: Array<{ name: string; args: Record<string, unknown> }>;
}

export interface AgentMemoryRecordTurnParams extends AgentMemoryScopeInput {
    contextId?: string;
    turnId?: string;
    sessionId?: string;
    messages?: AgentMemoryTurnMessage[];
    toolEvents?: Array<{
        name: string;
        toolName?: string;
        tool?: string;
        args?: Record<string, unknown>;
        input?: Record<string, unknown>;
        result?: string;
        output?: string;
        status?: string;
        timestamp?: number;
    }>;
    userMessage?: string;
    assistantMessage?: string;
    modelUsed?: string;
    model?: string;
    totalTokens?: number;
    tokenCount?: number;
    contextWindow?: number;
    summary?: string;
}

export interface AgentMemoryRememberParams extends AgentMemoryScopeInput {
    content: string;
    type?: string;
    scope?: string;
    retention?: string;
    conflictPolicy?: string;
    confidence?: number;
    enableGraph?: boolean;
}

export type AgentMemoryLoopParams =
    | ({ step: "pre_turn" } & AgentMemoryContextParams)
    | ({ step: "post_turn" } & AgentMemoryRecordTurnParams)
    | ({ step: "remember" } & AgentMemoryRememberParams);

export interface AgentMemoryCompactItem {
    layer: string;
    text: string;
    id?: string;
    score?: number;
    source?: string;
    createdAt?: number;
}

export interface AgentMemoryWorkflowEnvelope<TStep extends AgentMemoryLoopStep> {
    v: "compose.agent_memory.v1";
    step: TStep;
    next: AgentMemoryLoopStep[];
}

export interface AgentMemoryContextResponse {
    workflow: AgentMemoryWorkflowEnvelope<"pre_turn">;
    contextId: string;
    prompt: string | null;
    items: AgentMemoryCompactItem[];
    totals: Record<string, number>;
    contextUsage: {
        characters: number;
        rawCharacters: number;
        budgetCharacters?: number;
        savedCharactersVsRaw: number;
        items: number;
    };
    omitted: Record<string, number>;
    raw?: Record<string, unknown[]>;
}

export interface AgentMemoryRecordTurnResponse {
    workflow: AgentMemoryWorkflowEnvelope<"post_turn">;
    success: true;
    sessionId: string;
    threadId: string;
    turnId: string;
    vectorId?: string;
    stored: {
        /** Full transcript persisted to the `scene` layer (Mongo session_transcripts). */
        transcript: boolean;
        /** Working-memory rolling buffer updated for the active session. */
        working: boolean;
        /** Per-turn dense vector indexed for hybrid recall (Atlas $vectorSearch). */
        vector: boolean;
        /**
         * Durable facts extracted by the first-party graph layer
         * (gemini-3.1-flash-lite-preview → Voyage embeddings → `source: "fact"`
         * vectors). True if at least one fact was indexed or an existing
         * fact's accessCount was bumped.
         */
        graph: boolean;
    };
}

export interface AgentMemoryRememberResponse {
    workflow: AgentMemoryWorkflowEnvelope<"remember">;
    success: boolean;
    graphSaved: boolean;
    vectorSaved: boolean;
    vectorId?: string;
    memory?: {
        id?: string;
        text: string;
        type: string;
        retention?: string;
        confidence?: number;
        status: "active";
    };
}

export type AgentMemoryLoopResponse =
    | AgentMemoryContextResponse
    | AgentMemoryRecordTurnResponse
    | AgentMemoryRememberResponse;

export interface LayeredSearchParams extends AgentMemoryScopeInput {
    query: string;
    layers?: AgentMemoryLayer[];
    limit?: number;
}

export interface LayeredSearchResult {
    query: string;
    layers: Record<string, unknown[]>;
    totals: Record<string, number>;
}

export type MemorySource = "session" | "knowledge" | "pattern" | "archive" | "fact";

export interface SearchResult {
    id: string;
    vectorId?: string;
    content: string;
    score?: number;
    source: MemorySource;
    agentWallet: string;
    userAddress?: string;
    threadId?: string;
    mode?: "global" | "local";
    haiId?: string;
    decayScore?: number;
    accessCount?: number;
    createdAt?: number;
}

export interface MemoryVector {
    vectorId: string;
    id?: string;
    content: string;
    embedding?: number[];
    score?: number;
    source: MemorySource;
    agentWallet: string;
    userAddress?: string;
    threadId?: string;
    mode?: "global" | "local";
    haiId?: string;
    scopeKind?: "global" | "local";
    scopeId?: string;
    decayScore: number;
    accessCount: number;
    createdAt: number;
    lastAccessedAt: number;
    updatedAt?: number;
    metadata?: Record<string, unknown>;
}

export interface MemoryItemQuery {
    agentWallet?: string;
    userAddress?: string;
}

export interface MemoryItemUpdateParams extends MemoryItemQuery {
    threadId?: string;
    content?: string;
    metadata?: Record<string, unknown>;
    retention?: string;
    confidence?: number;
    status?: "active" | "superseded" | "archived";
    filters?: Record<string, unknown>;
}

export interface MemoryItemDeleteParams extends MemoryItemQuery {
    hardDelete?: boolean;
}

export interface MemoryJobCreateParams {
    type: "consolidate" | "patterns_extract" | "archive_create" | "decay_update" | "cleanup";
    execution?: "inline" | "temporal";
    agentWallet?: string;
    agentWallets?: string[];
    timeRange?: { start: number; end: number };
    dateRange?: { start: number; end: number };
    confidenceThreshold?: number;
    batchSize?: number;
    halfLifeDays?: number;
    olderThanDays?: number;
    compress?: boolean;
    syncToIpfs?: boolean;
}

export interface MemoryJobRecord {
    jobId: string;
    type: MemoryJobCreateParams["type"];
    execution: "inline" | "temporal";
    status: "running" | "completed" | "failed";
    agentWallet?: string;
    temporalWorkflowId?: string;
    temporalRunId?: string;
    data?: unknown;
    error?: string;
    createdAt: number;
    completedAt?: number;
}

export interface MemoryEvalRunParams extends AgentMemoryScopeInput {
    layers?: AgentMemoryLayer[];
    testCases: Array<{ query: string; expected?: string; expectedMemoryId?: string }>;
}

export interface MemoryEvalRunResponse {
    evalRunId: string;
    status: "completed";
    scores: {
        recallAtK: number;
        precisionAtK: number;
        avgContextCharacters: number;
        cases: number;
    };
    avgSearchLatencyMs: number;
    results: Array<{
        query: string;
        hit: boolean;
        returned: number;
        contextCharacters: number;
    }>;
}

export interface MemoryWorkflowStepManifest {
    operationId: string;
    method: "GET" | "POST" | "PATCH" | "DELETE";
    path: string;
    purpose?: string;
}

export interface MemoryWorkflowManifest {
    id: string;
    version: "compose.agent_memory.v1";
    description: string;
    loop?: "hot" | "durable" | "maintenance";
    tokenPolicy?: "returns compact prompt only" | "returns metadata only";
    steps: MemoryWorkflowStepManifest[];
}

export interface ProceduralPattern {
    patternId: string;
    agentWallet: string;
    mode?: "global" | "local";
    haiId?: string;
    patternType?: "workflow" | "decision" | "response" | "tool_sequence";
    trigger?: { type: string; value: string; conditions?: Record<string, unknown> };
    steps?: Array<{ action: string; params?: Record<string, unknown>; expectedOutcome?: string; order: number }>;
    summary: string;
    successRate?: number;
    executionCount?: number;
    lastExecuted?: number;
    metadata?: Record<string, unknown>;
    createdAt?: number;
    updatedAt?: number;
}

export interface LearnedSkill {
    skillId: string;
    name: string;
    description: string;
    category: string;
    trigger?: Record<string, unknown>;
    spawnConfig?: Record<string, unknown>;
    successRate?: number;
    usageCount?: number;
    creator?: string;
    agents?: string[];
    tags?: string[];
    createdAt?: number;
    updatedAt?: number;
}

export interface MemoryPatternValidation {
    valid: boolean;
    confidence: number;
    occurrences: number;
    successRate: number;
    toolSequence: string[];
}

export interface MemoryScheduleStatus {
    scheduleId: string;
    paused: boolean;
    lastRunAt?: number;
    nextRunAt?: number;
    note?: string;
}

export interface SessionMemory {
    sessionId: string;
    agentWallet: string;
    userAddress?: string;
    threadId?: string;
    mode?: "global" | "local";
    haiId?: string;
    workingMemory: {
        context: string[];
        entities: Record<string, unknown>;
        state: Record<string, unknown>;
    };
    metadata?: Record<string, unknown>;
    compressed: boolean;
    createdAt: number;
    expiresAt: number;
    lastAccessedAt: number;
}

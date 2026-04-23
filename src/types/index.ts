/**
 * Canonical Compose Market API types.
 *
 * These types are the public wire contract between the Compose backend
 * (`api.compose.market`) and the SDK. They mirror the OpenAPI spec under
 * api/openapi.yaml; if a mismatch is ever observed, the spec is authoritative
 * and this file is the one that needs updating.
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
    budgetLimit: number;
    budgetUsed: number;
    budgetReserved?: number;
    budgetRemaining: number;
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
    | "hugging face"
    | "aiml"
    | "vertex"
    | "cloudflare"
    | "deepgram"
    | "elevenlabs"
    | "cartesia"
    | "roboflow";

/**
 * Canonical Compose model card. This is exactly what `/v1/models`,
 * `/v1/models/all`, `/v1/models/search`, and `/v1/models/:id` return — one
 * entry per row, no wrapper, no translation layer.
 */
export interface Model {
    modelId: string;
    name: string | null;
    provider: ModelProvider;
    type: string | string[] | null;
    description: string | null;
    input: unknown;
    output: unknown;
    contextWindow: unknown;
    pricing: unknown;
    maxOutputTokens?: number;
    capabilities?: string[];
    ownedBy?: string;
    createdAt?: string | number;
    available?: boolean;
    availableFrom?: string[];
    hfInferenceProvider?: string;
    hfProviderId?: string;
}

export interface ModelListResponse {
    object: "list";
    data: Model[];
}

export interface ModelSearchInput {
    q?: string;
    modality?: "text" | "image" | "audio" | "video" | "embedding";
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

export interface ModelParamDefinition {
    type: "string" | "integer" | "number" | "boolean" | "array";
    required: boolean;
    default?: string | number | boolean;
    options?: Array<string | number>;
    description?: string;
}

export interface ModelParamsResponse {
    modelId: string;
    type: "video" | "image" | null;
    provider: string | null;
    params: Record<string, ModelParamDefinition>;
    defaults: Record<string, unknown>;
}

// =============================================================================
// Inference — Chat Completions
// =============================================================================

export type ChatRole = "system" | "user" | "assistant" | "tool";

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
    };
}

export type ChatToolChoice =
    | "none"
    | "auto"
    | "required"
    | { type: "function"; function: { name: string } };

export interface ChatCompletionsCreateParams {
    model: string;
    messages: ChatMessage[];
    stream?: boolean;
    temperature?: number;
    max_tokens?: number;
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

export interface ResponsesCreateParams {
    model: string;
    input: unknown;
    modalities?: Array<"text" | "image" | "audio" | "video">;
    stream?: boolean;
    instructions?: string;
    previous_response_id?: string;
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
    dimensions?: number;
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
    n?: number;
    size?: string;
    quality?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface ImagesResponse {
    created: number;
    data: Array<{ url?: string; b64_json?: string; revised_prompt?: string }>;
    compose_receipt?: Record<string, unknown>;
}

export interface AudioSpeechCreateParams {
    model: string;
    input: string;
    voice?: string;
    response_format?: string;
    speed?: number;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface AudioTranscriptionCreateParams {
    model: string;
    file: string | Blob | File | Uint8Array;
    filename?: string;
    language?: string;
    response_format?: string;
    provider?: ModelProvider;
    [key: string]: unknown;
}

export interface AudioTranscriptionResponse {
    text: string;
    compose_receipt?: Record<string, unknown>;
}

export interface VideoGenerateParams {
    model: string;
    prompt?: string;
    duration?: number;
    aspect_ratio?: string;
    resolution?: string;
    image_url?: string;
    provider?: ModelProvider;
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
    | { type: "thinking-start"; message: string }
    | { type: "thinking-end" }
    | { type: "tool-start"; toolName: string; summary?: string; content?: string }
    | { type: "tool-end"; toolName: string; summary?: string; failed: boolean; error?: string }
    | { type: "error"; code?: string; message: string; details?: Record<string, unknown> }
    | { type: "done" };

export interface AgentStreamCreateParams {
    agentWallet: string;
    message: string;
    threadId: string;
    userAddress: string;
    cloudPermissions?: unknown;
    composeRunId?: string;
    attachment?: unknown;
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
    attachment?: unknown;
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

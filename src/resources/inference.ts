import type { HttpClient } from "../http.js";
import type {
    AudioSpeechCreateParams,
    AudioTranscriptionCreateParams,
    AudioTranscriptionResponse,
    ChatCompletion,
    ChatCompletionChunk,
    ChatCompletionsCreateParams,
    ComposeReceipt,
    EmbeddingsCreateParams,
    EmbeddingsResponse,
    ImagesGenerateParams,
    ImagesResponse,
    ResponseObject,
    ResponseStreamEvent,
    ResponsesCreateParams,
    SessionBudgetSnapshot,
    SessionInvalidReason,
    VideoGenerateParams,
    VideoJobStatus,
    VideoStatusStreamEvent,
} from "../types/index.js";
import { BadRequestError, ComposeError } from "../errors.js";
import { parseSSEStream } from "../streaming/sse.js";
import { parseReceiptEvent } from "../streaming/receipt.js";
import {
    instrumentBillableResponse,
    type InferenceContext,
} from "./instrumentation.js";

export type { InferenceContext } from "./instrumentation.js";

export interface ComposeCallOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
    idempotencyKey?: string;
    composeRunId?: string;
    x402MaxAmountWei?: string;
    paymentSignature?: string;
    /** Override the Compose Key for this call. Passing `null` forces the raw x402 path. */
    composeKey?: string | null;
    /** Override the end-user wallet address for this call. */
    userAddress?: string;
    /** Override the chain id for this call. */
    chainId?: number;
}

/**
 * Typed wrapper returned by every billable, non-streaming inference call.
 *
 * `data`               — the parsed JSON body.
 * `receipt`            — the settlement receipt decoded from `X-Compose-Receipt`
 *                        (or mirrored from the `compose_receipt` body field).
 * `requestId`          — the server-issued `X-Request-Id` for tracing.
 * `response`           — the raw `Response` (still-readable if the caller asked
 *                        for `.asResponse()` directly; consumed here).
 * `budget`             — live `x-session-budget-*` snapshot parsed from
 *                        response headers, or `null` if the endpoint did not
 *                        emit budget headers.
 * `sessionInvalidReason` — truthy `x-compose-session-invalid` value when the
 *                        session must be torn down as a side effect of this
 *                        call (budget depleted, revoked, etc).
 */
export interface ComposeCompletion<T> {
    data: T;
    receipt: ComposeReceipt | null;
    requestId: string | null;
    response: Response;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

export interface ChatCompletionFinalResult {
    chatCompletion: ChatCompletion;
    receipt: ComposeReceipt | null;
    requestId: string | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

export interface ResponsesStreamFinalResult {
    response: ResponseObject | null;
    toolCalls: Array<{ id: string; name: string; arguments: string }>;
    receipt: ComposeReceipt | null;
    requestId: string | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

function buildCallHeaders(
    options: ComposeCallOptions | undefined,
    ctxWallet: { address: string | null; chainId: number | null },
    ctxToken: string | null,
) {
    // When the caller explicitly passes `composeKey: null`, force the raw x402
    // path by suppressing the instance-level token. Any other value (string or
    // undefined) falls back to the instance token.
    const tokenResolved = options && "composeKey" in options
        ? options.composeKey
        : ctxToken;

    return {
        userAddress: options?.userAddress ?? ctxWallet.address ?? undefined,
        chainId: options?.chainId ?? ctxWallet.chainId ?? undefined,
        composeKey: tokenResolved ?? undefined,
        paymentSignature: options?.paymentSignature,
        x402MaxAmountWei: options?.x402MaxAmountWei,
        idempotencyKey: options?.idempotencyKey,
        composeRunId: options?.composeRunId,
    };
}

/**
 * Read the response header / body pair produced by a billable call, extract
 * receipt + budget + invalid-reason, emit them on the SDK event bus, and
 * return the public `ComposeCompletion<T>` shape.
 */
function toComposeCompletion<T>(
    ctx: InferenceContext,
    response: Response,
    data: T,
): ComposeCompletion<T> {
    const result = instrumentBillableResponse(ctx, response, data);
    return {
        data: result.data,
        receipt: result.receipt,
        requestId: result.requestId,
        response: result.response,
        budget: result.budget,
        sessionInvalidReason: result.sessionInvalidReason,
    };
}

/**
 * Emit budget / receipt / invalid events for a streaming response. The receipt
 * is attached optionally because streaming calls produce it via the in-band
 * `compose.receipt` SSE frame, not necessarily via the header.
 */
function emitStreamingEvents(
    ctx: InferenceContext,
    response: Response,
    receipt: ComposeReceipt | null,
    requestId: string | null,
): { budget: SessionBudgetSnapshot | null; sessionInvalidReason: SessionInvalidReason | null } {
    const walletCtx = ctx.getWalletMaybe();
    // Budget / session-invalid headers are set on the initial SSE response
    // (before the stream body), so extracting them from `response` is fine.
    const { extractSessionBudgetFromResponse } = budgetExtractor;
    const { budget, sessionInvalidReason } = extractSessionBudgetFromResponse(response);

    if (receipt) {
        ctx.events.emit("receipt", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            receipt,
            requestId,
            source: "stream",
        });
    }
    if (budget) {
        ctx.events.emit("budget", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            snapshot: budget,
            requestId,
        });
    }
    if (sessionInvalidReason) {
        ctx.events.emit("sessionInvalid", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            reason: sessionInvalidReason,
            requestId,
        });
    }
    return { budget, sessionInvalidReason };
}

// Lazy-loaded to avoid a circular import through instrumentation.ts -> budget.ts
// (budget.ts is a pure leaf, so we just import it directly).
import * as budgetExtractor from "../streaming/budget.js";

/**
 * Async iterable returned by `inference.chat.completions.stream(...)` and
 * `inference.responses.stream(...)`. Exposes `.final()` for consumers that
 * want the reassembled final object + receipt without iterating manually.
 *
 * `for await (const chunk of stream) { ... }` consumes chunks; the generator's
 * return value is captured internally so a subsequent `await stream.final()`
 * resolves to the typed final object even when the caller drove iteration.
 */
export class ComposeStreamIterator<Chunk, Final> implements AsyncIterable<Chunk> {
    private readonly iterator: AsyncGenerator<Chunk, Final, void>;
    private finalResult: Final | null = null;
    private finalSettled = false;
    private finalPromise: Promise<Final> | null = null;

    constructor(iterator: AsyncGenerator<Chunk, Final, void>) {
        this.iterator = iterator;
    }

    [Symbol.asyncIterator](): AsyncIterator<Chunk, void, void> {
        const self = this;
        return {
            next: async (): Promise<IteratorResult<Chunk, void>> => {
                const r = await self.iterator.next();
                if (r.done) {
                    self.finalResult = r.value;
                    self.finalSettled = true;
                    return { done: true, value: undefined };
                }
                return { done: false, value: r.value };
            },
            return: async (): Promise<IteratorResult<Chunk, void>> => {
                const r = await self.iterator.return(undefined as unknown as Final);
                if (r.done) {
                    self.finalResult = r.value;
                    self.finalSettled = true;
                }
                return { done: true, value: undefined };
            },
        };
    }

    async final(): Promise<Final> {
        if (this.finalSettled) return this.finalResult as Final;
        if (this.finalPromise) return this.finalPromise;

        this.finalPromise = (async () => {
            let last: IteratorResult<Chunk, Final>;
            do {
                last = await this.iterator.next();
            } while (!last.done);
            this.finalResult = last.value;
            this.finalSettled = true;
            return last.value;
        })();

        return this.finalPromise;
    }
}

// ---------------------------------------------------------------------------
// Chat completions
// ---------------------------------------------------------------------------

class ChatCompletionsNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    async create(
        params: ChatCompletionsCreateParams,
        options?: ComposeCallOptions,
    ): Promise<ComposeCompletion<ChatCompletion>> {
        if (params.stream === true) {
            throw new BadRequestError({
                message: "Pass stream: true only to chat.completions.stream(). Use create() for non-streaming calls.",
            });
        }
        const { data, response } = await this.client.request<ChatCompletion>({
            method: "POST",
            path: "/v1/chat/completions",
            body: { ...params, stream: false },
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();

        return toComposeCompletion(this.ctx, response, data);
    }

    stream(
        params: ChatCompletionsCreateParams,
        options?: ComposeCallOptions,
    ): ComposeStreamIterator<ChatCompletionChunk, ChatCompletionFinalResult> {
        const iterator = streamChatCompletions(this.client, this.ctx, params, options);
        return new ComposeStreamIterator(iterator);
    }
}

async function* streamChatCompletions(
    client: HttpClient,
    ctx: InferenceContext,
    params: ChatCompletionsCreateParams,
    options: ComposeCallOptions | undefined,
): AsyncGenerator<ChatCompletionChunk, ChatCompletionFinalResult, void> {
    const response = await client.request<unknown>({
        method: "POST",
        path: "/v1/chat/completions",
        body: { ...params, stream: true },
        headers: buildCallHeaders(options, ctx.getWalletMaybe(), ctx.getTokenMaybe()),
        signal: options?.signal,
        timeoutMs: options?.timeoutMs,
        expectStream: true,
    }).asResponse();

    if (!response.body) {
        throw new ComposeError({
            code: "upstream_error",
            message: "Streaming response had no body",
        });
    }

    let receipt: ComposeReceipt | null = null;
    const aggregator = buildChatCompletionAggregator(params.model);
    const emittedToolStarts = new Set<string>();
    let streamError: ComposeError | null = null;

    try {
        for await (const frame of parseSSEStream(response.body, { signal: options?.signal })) {
            if (frame.event === "compose.receipt") {
                try { receipt = parseReceiptEvent(frame.data); } catch { /* ignore */ }
                continue;
            }
            if (frame.event === "compose.error") {
                try {
                    const parsed = JSON.parse(frame.data) as { code?: string; message?: string; details?: Record<string, unknown> };
                    streamError = new ComposeError({
                        code: (parsed.code as never) ?? "upstream_error",
                        message: parsed.message ?? "Stream error",
                        details: parsed.details,
                    });
                } catch { /* ignore */ }
                continue;
            }
            if (frame.data === "[DONE]") {
                break;
            }
            if (frame.event !== "message") {
                // Unknown Compose-specific frames: surface nothing to the chunk stream.
                continue;
            }
            let parsed: ChatCompletionChunk;
            try {
                parsed = JSON.parse(frame.data) as ChatCompletionChunk;
            } catch {
                continue;
            }
            aggregator.absorb(parsed);

            // Unified tool-call lifecycle events. The chat stream reports
            // tool_call deltas; each delta with an `id` signals a new call
            // (or continues an existing one). We emit toolCallStart on first
            // sight and toolCallEnd when the chunk's finish_reason is set.
            const walletCtx = ctx.getWalletMaybe();
            const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
            const deltaToolCalls = parsed.choices?.[0]?.delta?.tool_calls;
            if (Array.isArray(deltaToolCalls)) {
                for (const toolCall of deltaToolCalls) {
                    if (toolCall.id && !emittedToolStarts.has(toolCall.id)) {
                        emittedToolStarts.add(toolCall.id);
                        ctx.events.emit("toolCallStart", {
                            userAddress: walletCtx.address,
                            chainId: walletCtx.chainId,
                            requestId,
                            source: "chat",
                            toolCallId: toolCall.id,
                            toolName: toolCall.function?.name ?? "",
                            arguments: toolCall.function?.arguments,
                        });
                    }
                }
            }
            const finishReason = parsed.choices?.[0]?.finish_reason;
            if (finishReason === "tool_calls") {
                const finalTools = aggregator.snapshotToolCalls();
                for (const tc of finalTools) {
                    ctx.events.emit("toolCallEnd", {
                        userAddress: walletCtx.address,
                        chainId: walletCtx.chainId,
                        requestId,
                        source: "chat",
                        toolCallId: tc.id,
                        toolName: tc.function.name,
                        arguments: tc.function.arguments,
                        failed: false,
                    });
                }
            }

            yield parsed;
        }

        if (streamError) throw streamError;

        const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
        const { budget, sessionInvalidReason } = emitStreamingEvents(ctx, response, receipt, requestId);

        return {
            chatCompletion: aggregator.finalize(),
            receipt,
            requestId,
            budget,
            sessionInvalidReason,
        };
    } finally {
        try { response.body?.cancel(); } catch { /* best-effort */ }
    }
}

function buildChatCompletionAggregator(modelHint: string) {
    let id = "";
    let created = 0;
    let model = modelHint;
    let role: "assistant" | undefined = undefined;
    let content = "";
    let reasoningContent = "";
    let finishReason = "stop";
    const toolCalls = new Map<number, { id: string; type: "function"; function: { name: string; arguments: string } }>();
    let usage: ChatCompletion["usage"] | undefined;

    return {
        absorb(chunk: ChatCompletionChunk): void {
            id = id || chunk.id;
            created = created || chunk.created;
            model = model || chunk.model;
            if (chunk.usage) usage = chunk.usage;

            const choice = chunk.choices?.[0];
            if (!choice) return;
            if (choice.finish_reason) finishReason = choice.finish_reason;

            const delta = choice.delta;
            if (delta?.role) role = delta.role;
            if (typeof delta?.content === "string") content += delta.content;
            if (typeof delta?.reasoning_content === "string") reasoningContent += delta.reasoning_content;

            if (Array.isArray(delta?.tool_calls)) {
                for (const toolCall of delta.tool_calls) {
                    const idx = toolCall.index ?? 0;
                    const existing = toolCalls.get(idx) ?? {
                        id: toolCall.id ?? `call_${idx}`,
                        type: "function" as const,
                        function: { name: "", arguments: "" },
                    };
                    if (toolCall.id) existing.id = toolCall.id;
                    if (toolCall.function?.name) existing.function.name += toolCall.function.name;
                    if (toolCall.function?.arguments) existing.function.arguments += toolCall.function.arguments;
                    toolCalls.set(idx, existing);
                }
            }
        },
        snapshotToolCalls(): Array<{ id: string; type: "function"; function: { name: string; arguments: string } }> {
            return Array.from(toolCalls.values());
        },
        finalize(): ChatCompletion {
            return {
                id,
                object: "chat.completion",
                created,
                model,
                choices: [
                    {
                        index: 0,
                        message: {
                            role: role ?? "assistant",
                            content,
                            ...(toolCalls.size > 0 ? { tool_calls: Array.from(toolCalls.values()) } : {}),
                            ...(reasoningContent.length > 0 ? { reasoning_content: reasoningContent } as unknown as { role: "assistant"; content: string | null } : {}),
                        } as ChatCompletion["choices"][number]["message"],
                        finish_reason: finishReason,
                    },
                ],
                usage: usage ?? { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
            };
        },
    };
}

// ---------------------------------------------------------------------------
// Responses API
// ---------------------------------------------------------------------------

class ResponsesNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    async create(
        params: ResponsesCreateParams,
        options?: ComposeCallOptions,
    ): Promise<ComposeCompletion<ResponseObject>> {
        if (params.stream === true) {
            throw new BadRequestError({
                message: "Pass stream: true only to responses.stream(). Use create() for non-streaming calls.",
            });
        }
        const { data, response } = await this.client.request<ResponseObject>({
            method: "POST",
            path: "/v1/responses",
            body: { ...params, stream: false },
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }

    stream(
        params: ResponsesCreateParams,
        options?: ComposeCallOptions,
    ): ComposeStreamIterator<ResponseStreamEvent, ResponsesStreamFinalResult> {
        const iterator = streamResponses(this.client, this.ctx, params, options);
        return new ComposeStreamIterator(iterator);
    }

    async get(responseId: string, options?: ComposeCallOptions): Promise<ResponseObject> {
        return this.client.request<ResponseObject>({
            method: "GET",
            path: `/v1/responses/${encodeURIComponent(responseId)}`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }

    async inputItems(responseId: string, options?: ComposeCallOptions): Promise<{ object: "list"; data: Record<string, unknown>[] }> {
        return this.client.request({
            method: "GET",
            path: `/v1/responses/${encodeURIComponent(responseId)}/input_items`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }

    async cancel(responseId: string, options?: ComposeCallOptions): Promise<ResponseObject> {
        return this.client.request<ResponseObject>({
            method: "POST",
            path: `/v1/responses/${encodeURIComponent(responseId)}/cancel`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }
}

async function* streamResponses(
    client: HttpClient,
    ctx: InferenceContext,
    params: ResponsesCreateParams,
    options: ComposeCallOptions | undefined,
): AsyncGenerator<ResponseStreamEvent, ResponsesStreamFinalResult, void> {
    const response = await client.request<unknown>({
        method: "POST",
        path: "/v1/responses",
        body: { ...params, stream: true },
        headers: buildCallHeaders(options, ctx.getWalletMaybe(), ctx.getTokenMaybe()),
        signal: options?.signal,
        timeoutMs: options?.timeoutMs,
        expectStream: true,
    }).asResponse();

    if (!response.body) {
        throw new ComposeError({ code: "upstream_error", message: "Streaming response had no body" });
    }

    let receipt: ComposeReceipt | null = null;
    let lastCompleted: ResponseStreamEvent | null = null;
    let streamError: ComposeError | null = null;
    const toolCallAggregator = new Map<string, { id: string; name: string; arguments: string; index: number }>();

    try {
        for await (const frame of parseSSEStream(response.body, { signal: options?.signal })) {
            if (frame.event === "compose.receipt") {
                try { receipt = parseReceiptEvent(frame.data); } catch { /* ignore */ }
                continue;
            }
            if (frame.event === "compose.error") {
                try {
                    const parsed = JSON.parse(frame.data) as { code?: string; message?: string };
                    streamError = new ComposeError({
                        code: (parsed.code as never) ?? "upstream_error",
                        message: parsed.message ?? "Stream error",
                    });
                } catch { /* ignore */ }
                continue;
            }
            if (frame.data === "[DONE]") {
                break;
            }
            if (frame.event !== "message") continue;

            let parsed: ResponseStreamEvent;
            try {
                parsed = JSON.parse(frame.data) as ResponseStreamEvent;
            } catch {
                continue;
            }

            // Assemble tool_call + tool_call.delta frames so the final result
            // carries ready-to-consume `{id,name,arguments}` entries.
            if (parsed.type === "response.tool_call") {
                const tc = parsed.tool_call;
                if (tc && tc.id) {
                    const existing = toolCallAggregator.get(tc.id) ?? {
                        id: tc.id,
                        name: tc.name ?? "",
                        arguments: tc.arguments ?? "",
                        index: toolCallAggregator.size,
                    };
                    if (tc.name) existing.name = tc.name;
                    if (tc.arguments) existing.arguments = tc.arguments;
                    toolCallAggregator.set(tc.id, existing);
                    const walletCtx = ctx.getWalletMaybe();
                    ctx.events.emit("toolCallStart", {
                        userAddress: walletCtx.address,
                        chainId: walletCtx.chainId,
                        requestId: response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id"),
                        source: "responses",
                        toolCallId: existing.id,
                        toolName: existing.name,
                        summary: existing.arguments,
                        arguments: existing.arguments,
                    });
                }
            }

            if (parsed.type === "response.tool_call.delta") {
                const delta = parsed.delta;
                if (delta) {
                    const idx = parsed.index;
                    const key = delta.id ?? String(idx);
                    const existing = toolCallAggregator.get(key) ?? {
                        id: delta.id ?? `call_${idx}`,
                        name: "",
                        arguments: "",
                        index: idx,
                    };
                    if (delta.id) existing.id = delta.id;
                    if (delta.name) existing.name += delta.name;
                    if (delta.arguments) existing.arguments += delta.arguments;
                    toolCallAggregator.set(key, existing);
                }
            }

            if (parsed.type === "response.completed") {
                lastCompleted = parsed;
                // Emit toolCallEnd for every aggregated tool call — responses
                // API doesn't have a per-tool end event, so the completion
                // frame is the natural terminal point.
                const walletCtx = ctx.getWalletMaybe();
                const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
                for (const aggregated of toolCallAggregator.values()) {
                    ctx.events.emit("toolCallEnd", {
                        userAddress: walletCtx.address,
                        chainId: walletCtx.chainId,
                        requestId,
                        source: "responses",
                        toolCallId: aggregated.id,
                        toolName: aggregated.name,
                        summary: aggregated.arguments,
                        arguments: aggregated.arguments,
                        failed: false,
                    });
                }
            }
            yield parsed;
        }

        if (streamError) throw streamError;

        const finalResponse: ResponseObject | null = lastCompleted
            ? {
                id: lastCompleted.response_id,
                object: "response",
                created_at: Math.floor(Date.now() / 1000),
                status: "completed",
                model: lastCompleted.model,
                output: [],
                ...(lastCompleted.usage
                    ? {
                        usage: {
                            input_tokens: lastCompleted.usage.input_tokens,
                            output_tokens: lastCompleted.usage.output_tokens,
                            total_tokens: lastCompleted.usage.total_tokens,
                        },
                    }
                    : {}),
            }
            : null;

        const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
        const { budget, sessionInvalidReason } = emitStreamingEvents(ctx, response, receipt, requestId);

        const toolCalls = Array.from(toolCallAggregator.values())
            .sort((a, b) => a.index - b.index)
            .map(({ id, name, arguments: args }) => ({ id, name, arguments: args }));

        return {
            response: finalResponse,
            toolCalls,
            receipt,
            requestId,
            budget,
            sessionInvalidReason,
        };
    } finally {
        try { response.body?.cancel(); } catch { /* best-effort */ }
    }
}

// ---------------------------------------------------------------------------
// Embeddings
// ---------------------------------------------------------------------------

class EmbeddingsNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    async create(params: EmbeddingsCreateParams, options?: ComposeCallOptions): Promise<ComposeCompletion<EmbeddingsResponse>> {
        const { data, response } = await this.client.request<EmbeddingsResponse>({
            method: "POST",
            path: "/v1/embeddings",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------

class ImagesNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    async generate(params: ImagesGenerateParams, options?: ComposeCallOptions): Promise<ComposeCompletion<ImagesResponse>> {
        const { data, response } = await this.client.request<ImagesResponse>({
            method: "POST",
            path: "/v1/images/generations",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }

    async edit(params: ImagesGenerateParams & { image?: string }, options?: ComposeCallOptions): Promise<ComposeCompletion<ImagesResponse>> {
        const { data, response } = await this.client.request<ImagesResponse>({
            method: "POST",
            path: "/v1/images/edits",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }
}

// ---------------------------------------------------------------------------
// Audio
// ---------------------------------------------------------------------------

class AudioNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    /**
     * Text-to-speech. Returns the raw audio `Response` (stream the body via
     * `response.body` or `await response.arrayBuffer()`), plus any receipt
     * extracted from response headers, plus the live budget snapshot.
     */
    async speech(params: AudioSpeechCreateParams, options?: ComposeCallOptions): Promise<{
        response: Response;
        receipt: ComposeReceipt | null;
        requestId: string | null;
        budget: SessionBudgetSnapshot | null;
        sessionInvalidReason: SessionInvalidReason | null;
    }> {
        const response = await this.client.request<unknown>({
            method: "POST",
            path: "/v1/audio/speech",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
            expectStream: true,
        }).asResponse();

        // No JSON body to mirror; receipt comes from the header only.
        const result = instrumentBillableResponse(this.ctx, response, undefined);
        return {
            response,
            receipt: result.receipt,
            requestId: result.requestId,
            budget: result.budget,
            sessionInvalidReason: result.sessionInvalidReason,
        };
    }

    /**
     * Speech-to-text. Supports both multipart/form-data (preferred, OpenAI-
     * compatible) when `file` is a `Blob`/`File`/`Uint8Array`, and base64-in-
     * JSON (Compose legacy) when `file` is a string.
     */
    async transcriptions(params: AudioTranscriptionCreateParams, options?: ComposeCallOptions): Promise<ComposeCompletion<AudioTranscriptionResponse>> {
        const useMultipart = typeof File !== "undefined" && params.file instanceof File
            || typeof Blob !== "undefined" && params.file instanceof Blob
            || (params.file && typeof params.file === "object" && "byteLength" in (params.file as object));

        if (useMultipart) {
            const form = new FormData();
            form.append("model", params.model);
            const { file, filename, model: _model, ...rest } = params;
            void _model;
            const name = filename ?? "audio";
            let blob: Blob;
            if (typeof File !== "undefined" && file instanceof File) blob = file;
            else if (typeof Blob !== "undefined" && file instanceof Blob) blob = file;
            else if ((file as Uint8Array).byteLength !== undefined) {
                const bytes = file as Uint8Array;
                const copy = new Uint8Array(new ArrayBuffer(bytes.byteLength));
                copy.set(bytes);
                blob = new Blob([copy.buffer]);
            }
            else throw new BadRequestError({ message: "audio transcriptions: unsupported file type" });
            form.append("file", blob, name);
            for (const [key, value] of Object.entries(rest)) {
                if (value === undefined) continue;
                form.append(key, typeof value === "string" ? value : JSON.stringify(value));
            }

            const { data, response } = await this.client.request<AudioTranscriptionResponse>({
                method: "POST",
                path: "/v1/audio/transcriptions",
                rawBody: form,
                bodyType: "form-data",
                headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
                signal: options?.signal,
                timeoutMs: options?.timeoutMs,
            }).withResponse();
            return toComposeCompletion(this.ctx, response, data);
        }

        const { data, response } = await this.client.request<AudioTranscriptionResponse>({
            method: "POST",
            path: "/v1/audio/transcriptions",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }
}

// ---------------------------------------------------------------------------
// Videos
// ---------------------------------------------------------------------------

class VideosNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) {}

    async generate(params: VideoGenerateParams, options?: ComposeCallOptions): Promise<ComposeCompletion<{ job_id?: string; id?: string } & Record<string, unknown>>> {
        const { data, response } = await this.client.request<{ job_id?: string; id?: string } & Record<string, unknown>>({
            method: "POST",
            path: "/v1/videos/generations",
            body: params,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }).withResponse();
        return toComposeCompletion(this.ctx, response, data);
    }

    get(videoId: string, options?: ComposeCallOptions): Promise<VideoJobStatus> {
        return Promise.resolve(this.client.request<VideoJobStatus>({
            method: "GET",
            path: `/v1/videos/${encodeURIComponent(videoId)}`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }));
    }

    /**
     * Server-driven polling via SSE. Subscribes to `/v1/videos/:id/stream`
     * and yields each status update as it arrives, terminating on the
     * `completed` or `failed` state.
     */
    stream(
        videoId: string,
        opts: ComposeCallOptions & { pollIntervalMs?: number; timeoutMs?: number } = {},
    ): ComposeStreamIterator<VideoStatusStreamEvent, { final: VideoJobStatus | null; requestId: string | null }> {
        const iterator = streamVideoStatus(this.client, this.ctx, videoId, opts);
        return new ComposeStreamIterator(iterator);
    }

    /**
     * Convenience helper: resolves once the video job hits a terminal state,
     * driven by the server-side SSE poller. Aborts after `timeoutMs` elapses.
     */
    async waitUntilDone(
        videoId: string,
        opts: ComposeCallOptions & {
            pollIntervalMs?: number;
            timeoutMs?: number;
            onStatus?: (status: VideoStatusStreamEvent) => void;
        } = {},
    ): Promise<VideoJobStatus | null> {
        const stream = this.stream(videoId, opts);
        for await (const event of stream) {
            opts.onStatus?.(event);
        }
        const { final } = await stream.final();
        return final;
    }
}

async function* streamVideoStatus(
    client: HttpClient,
    ctx: InferenceContext,
    videoId: string,
    opts: ComposeCallOptions & { pollIntervalMs?: number; timeoutMs?: number },
): AsyncGenerator<VideoStatusStreamEvent, { final: VideoJobStatus | null; requestId: string | null }, void> {
    const query: Record<string, string> = {};
    if (opts.pollIntervalMs !== undefined) query.pollIntervalMs = String(opts.pollIntervalMs);
    if (opts.timeoutMs !== undefined) query.timeoutMs = String(opts.timeoutMs);

    const response = await client.request<unknown>({
        method: "GET",
        path: `/v1/videos/${encodeURIComponent(videoId)}/stream`,
        query,
        headers: buildCallHeaders(opts, ctx.getWalletMaybe(), ctx.getTokenMaybe()),
        signal: opts.signal,
        timeoutMs: opts.timeoutMs,
        expectStream: true,
    }).asResponse();

    if (!response.body) {
        throw new ComposeError({ code: "upstream_error", message: "Streaming response had no body" });
    }

    let lastStatus: VideoJobStatus | null = null;

    try {
        for await (const frame of parseSSEStream(response.body, { signal: opts.signal })) {
            if (frame.data === "[DONE]") {
                yield { type: "done" };
                break;
            }
            if (frame.event === "compose.video.status") {
                try {
                    const parsed = JSON.parse(frame.data) as {
                        jobId: string;
                        status: "queued" | "processing" | "completed" | "failed";
                        progress?: number;
                        url?: string;
                        error?: string;
                    };
                    lastStatus = {
                        id: parsed.jobId,
                        object: "video.generation",
                        status: parsed.status,
                        url: parsed.url,
                        error: parsed.error,
                        progress: parsed.progress,
                    };
                    yield { type: "compose.video.status", ...parsed };
                } catch { /* skip malformed frame */ }
                continue;
            }
            if (frame.event === "compose.error") {
                try {
                    const parsed = JSON.parse(frame.data) as { code?: string; message?: string; details?: Record<string, unknown> };
                    yield { type: "compose.error", code: parsed.code ?? "upstream_error", message: parsed.message ?? "Stream error", details: parsed.details };
                } catch { /* skip */ }
                continue;
            }
        }

        return {
            final: lastStatus,
            requestId: response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id"),
        };
    } finally {
        try { response.body?.cancel(); } catch { /* best-effort */ }
    }
}

// ---------------------------------------------------------------------------
// Top-level inference resource
// ---------------------------------------------------------------------------

export class InferenceResource {
    readonly chat: { completions: ChatCompletionsNamespace };
    readonly responses: ResponsesNamespace;
    readonly embeddings: EmbeddingsNamespace;
    readonly images: ImagesNamespace;
    readonly audio: AudioNamespace;
    readonly videos: VideosNamespace;

    constructor(
        client: HttpClient,
        ctx: InferenceContext,
    ) {
        this.chat = { completions: new ChatCompletionsNamespace(client, ctx) };
        this.responses = new ResponsesNamespace(client, ctx);
        this.embeddings = new EmbeddingsNamespace(client, ctx);
        this.images = new ImagesNamespace(client, ctx);
        this.audio = new AudioNamespace(client, ctx);
        this.videos = new VideosNamespace(client, ctx);
    }
}

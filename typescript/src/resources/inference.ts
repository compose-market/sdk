import type { HttpClient, RequestOptions } from "../http.js";
import type {
    Receipt,
    PaymentMode,
    ResponseOutputItem,
    ResponseObject,
    ResponsesCreateParams,
    SessionBudgetSnapshot,
    SessionInvalidReason,
    X402PaymentSignature,
    X402PaymentSigner,
} from "../types/index.js";
import { AuthenticationError, BadRequestError, Error, PaymentRequiredError } from "../errors.js";
import { parseSSEStream } from "@compose-market/core/transport";
import { parseReceiptEvent } from "@compose-market/core/sse/receipt";
import { decode as decodeModelEvent, type ModelEvent } from "@compose-market/core/model";
import { encodePaymentSignature } from "./x402.js";
import {
    instrumentBillableResponse,
    type InferenceContext,
} from "./instrumentation.js";

export type { InferenceContext } from "./instrumentation.js";

type WireResponseStreamEvent =
    | { type: "response.created"; response: ResponseObject }
    | { type: "response.output_text.delta"; response_id: string; model: string; delta: string }
    | { type: "response.reasoning.delta"; response_id: string; model: string; delta: string }
    | { type: "response.tool_call"; response_id: string; model: string; tool_call: { id: string; name: string; arguments: string } }
    | { type: "response.tool_call.delta"; response_id: string; model: string; index: number; delta: { id?: string; name?: string; arguments?: string } }
    | { type: "response.image_generation_call.partial_image"; response_id: string; model: string; partial_image_index: number; partial_image_b64: string }
    | { type: "response.image_generation_call.completed"; response_id: string; model: string; image_b64: string; mime_type?: string; revised_prompt?: string; usage?: { input_tokens: number; output_tokens: number; total_tokens: number } }
    | { type: "response.output_item.completed"; response_id: string; model: string; output_index: number; item: ResponseOutputItem }
    | { type: "response.output_video.status"; response_id: string; model: string; job_id: string; status: "queued" | "processing" | "completed" | "failed"; progress?: number; url?: string; error?: string }
    | { type: "response.completed"; response_id: string; model: string; finish_reason: string; usage?: { input_tokens: number; output_tokens: number; total_tokens: number } };

export interface CallOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
    idempotencyKey?: string;
    composeRunId?: string;
    x402MaxAmountWei?: string;
    paymentSignature?: X402PaymentSignature;
    /**
     * Payment path for this call.
     * - auto: use Compose Key first when present, otherwise negotiate raw x402.
     * - composeKey: require the Compose Key path and do not fall back to x402.
     * - x402: suppress Compose Key auth and negotiate raw x402.
     */
    paymentMode?: PaymentMode;
    /** Per-call signer used to answer a PAYMENT-REQUIRED challenge. */
    x402Signer?: X402PaymentSigner;
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
 * `receipt`            — the settlement receipt decoded from `X-Receipt`
 *                        (or mirrored from the `receipt` body field).
 * `requestId`          — the server-issued `X-Request-Id` for tracing.
 * `response`           — the raw `Response` (still-readable if the caller asked
 *                        for `.asResponse()` directly; consumed here).
 * `budget`             — live `x-session-budget-*` snapshot parsed from
 *                        response headers, or `null` if the endpoint did not
 *                        emit budget headers.
 * `sessionInvalidReason` — truthy `x-session-invalid` value when the
 *                        session must be torn down as a side effect of this
 *                        call (budget depleted, revoked, etc).
 */
export interface Completion<T> {
    data: T;
    receipt: Receipt | null;
    requestId: string | null;
    response: Response;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

export interface ResponsesStreamFinalResult {
    response: ResponseObject | null;
    toolCalls: Array<{ id: string; name: string; arguments: string }>;
    receipt: Receipt | null;
    requestId: string | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

export function buildCallHeaders(
    options: CallOptions | undefined,
    ctxWallet: { address: string | null; chainId: number | null },
    ctxToken: string | null,
) {
    // When the caller explicitly passes `composeKey: null`, force the raw x402
    // path by suppressing the instance-level token. Any other value (string or
    // undefined) falls back to the instance token.
    const tokenResolved = options?.paymentMode === "x402"
        ? null
        : options && "composeKey" in options
            ? options.composeKey
            : ctxToken;

    return {
        userAddress: options?.userAddress ?? ctxWallet.address ?? undefined,
        chainId: options?.chainId ?? ctxWallet.chainId ?? undefined,
        composeKey: tokenResolved ?? undefined,
        paymentSignature: options?.paymentSignature ? encodePaymentSignature(options.paymentSignature) : undefined,
        x402MaxAmountWei: options?.x402MaxAmountWei,
        idempotencyKey: options?.idempotencyKey,
        composeRunId: options?.composeRunId,
    };
}

function resolvePaymentMode(options: CallOptions | undefined): PaymentMode {
    return options?.paymentMode ?? "auto";
}

function resolveX402Signer(ctx: InferenceContext, options: CallOptions | undefined): X402PaymentSigner | null {
    return options?.x402Signer ?? ctx.getX402SignerMaybe?.() ?? null;
}

async function buildX402RetryConfig(
    error: unknown,
    config: RequestOptions,
    ctx: InferenceContext,
    options: CallOptions | undefined,
): Promise<RequestOptions | null> {
    if (!(error instanceof PaymentRequiredError) || !error.paymentRequired) {
        return null;
    }
    if (resolvePaymentMode(options) === "composeKey") {
        return null;
    }
    const signer = resolveX402Signer(ctx, options);
    if (!signer) {
        return null;
    }

    const wallet = ctx.getWalletMaybe();
    const signed = await signer({
        paymentRequired: error.paymentRequired,
        paymentRequiredHeader: error.paymentRequiredHeader,
        method: config.method,
        path: config.path,
        url: error.paymentRequired.resource.url,
        body: config.body,
        userAddress: options?.userAddress ?? wallet.address,
        chainId: options?.chainId ?? wallet.chainId,
        maxAmountWei: options?.x402MaxAmountWei,
    });

    return {
        ...config,
        headers: {
            ...(config.headers ?? {}),
            composeKey: null,
            paymentSignature: encodePaymentSignature(signed),
        },
    };
}

function shouldRetryInvalidKeyAsX402(
    error: unknown,
    ctx: InferenceContext,
    options: CallOptions | undefined,
): boolean {
    return error instanceof AuthenticationError
        && resolvePaymentMode(options) === "auto"
        && Boolean(ctx.getTokenMaybe())
        && Boolean(resolveX402Signer(ctx, options));
}

function suppressKey(config: RequestOptions): RequestOptions {
    return {
        ...config,
        headers: {
            ...(config.headers ?? {}),
            composeKey: null,
            paymentSignature: undefined,
        },
    };
}

async function requestJsonWithPayment<T>(
    client: HttpClient,
    ctx: InferenceContext,
    config: RequestOptions,
    options: CallOptions | undefined,
): Promise<{ data: T; response: Response }> {
    try {
        return await client.request<T>(config).withResponse();
    } catch (error) {
        const retryConfig = await buildX402RetryConfig(error, config, ctx, options);
        if (retryConfig) return client.request<T>(retryConfig).withResponse();

        if (shouldRetryInvalidKeyAsX402(error, ctx, options)) {
            const challengeConfig = suppressKey(config);
            try {
                return await client.request<T>(challengeConfig).withResponse();
            } catch (challengeError) {
                const signedRetryConfig = await buildX402RetryConfig(challengeError, challengeConfig, ctx, options);
                if (signedRetryConfig) return client.request<T>(signedRetryConfig).withResponse();
                throw challengeError;
            }
        }

        throw error;
    }
}

export async function requestResponseWithPayment<T>(
    client: HttpClient,
    ctx: InferenceContext,
    config: RequestOptions,
    options: CallOptions | undefined,
): Promise<Response> {
    try {
        return await client.request<T>(config).asResponse();
    } catch (error) {
        const retryConfig = await buildX402RetryConfig(error, config, ctx, options);
        if (retryConfig) return client.request<T>(retryConfig).asResponse();

        if (shouldRetryInvalidKeyAsX402(error, ctx, options)) {
            const challengeConfig = suppressKey(config);
            try {
                return await client.request<T>(challengeConfig).asResponse();
            } catch (challengeError) {
                const signedRetryConfig = await buildX402RetryConfig(challengeError, challengeConfig, ctx, options);
                if (signedRetryConfig) return client.request<T>(signedRetryConfig).asResponse();
                throw challengeError;
            }
        }

        throw error;
    }
}

function isReceiptEvent(event: string | undefined): boolean {
    return event === "receipt" || event === "receipt";
}

/**
 * Read the response header / body pair produced by a billable call, extract
 * receipt + budget + invalid-reason, emit them on the SDK event bus, and
 * return the public `Completion<T>` shape.
 */
function toCompletion<T>(
    ctx: InferenceContext,
    response: Response,
    data: T,
): Completion<T> {
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
 * `receipt` SSE frame, not necessarily via the header.
 */
function emitStreamingEvents(
    ctx: InferenceContext,
    response: Response,
    receipt: Receipt | null,
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
import * as budgetExtractor from "@compose-market/core/sse/budget";

/**
 * Async iterable returned by `inference.responses.stream(...)`. Exposes
 * `.final()` for consumers that
 * want the reassembled final object + receipt without iterating manually.
 *
 * `for await (const chunk of stream) { ... }` consumes chunks; the generator's
 * return value is captured internally so a subsequent `await stream.final()`
 * resolves to the typed final object even when the caller drove iteration.
 */
export class StreamIterator<Chunk, Final> implements AsyncIterable<Chunk> {
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

function mergeSignals(a: AbortSignal | undefined, b: AbortSignal): { signal: AbortSignal; cleanup: () => void } {
    if (!a) return { signal: b, cleanup: () => { } };
    const c = new AbortController();
    const forward = () => c.abort();
    if (a.aborted || b.aborted) c.abort();
    a.addEventListener("abort", forward, { once: true });
    b.addEventListener("abort", forward, { once: true });
    return {
        signal: c.signal,
        cleanup: () => {
            a.removeEventListener("abort", forward);
            b.removeEventListener("abort", forward);
        },
    };
}

function cleanse<T extends Record<string, unknown>>(params: T): T {
    const { provider: _provider, ...body } = params;
    return body as T;
}

// ---------------------------------------------------------------------------
// Responses API
// ---------------------------------------------------------------------------

class ResponsesNamespace {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: InferenceContext,
    ) { }

    async create(
        params: ResponsesCreateParams,
        options?: CallOptions,
    ): Promise<Completion<ResponseObject>> {
        if (params.stream === true) {
            throw new BadRequestError({
                message: "Pass stream: true only to responses.stream(). Use create() for non-streaming calls.",
            });
        }
        const { data, response } = await requestJsonWithPayment<ResponseObject>(this.client, this.ctx, {
            method: "POST",
            path: "/v1/responses",
            body: { ...cleanse(params), stream: false },
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        }, options);
        return toCompletion(this.ctx, response, data);
    }

    stream(
        params: ResponsesCreateParams,
        options?: CallOptions,
    ): StreamIterator<ModelEvent, ResponsesStreamFinalResult> {
        const iterator = streamResponses(this.client, this.ctx, params, options);
        return new StreamIterator(iterator);
    }

    async get(responseId: string, options?: CallOptions): Promise<ResponseObject> {
        return this.client.request<ResponseObject>({
            method: "GET",
            path: `/v1/responses/${encodeURIComponent(responseId)}`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }

    async inputItems(responseId: string, options?: CallOptions): Promise<{ object: "list"; data: Record<string, unknown>[] }> {
        return this.client.request({
            method: "GET",
            path: `/v1/responses/${encodeURIComponent(responseId)}/input_items`,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }

    async append(
        responseId: string,
        params: { input?: unknown; params?: Record<string, unknown>; custom_params?: Record<string, unknown>;[key: string]: unknown } | unknown,
        options?: CallOptions,
    ): Promise<{ object: "list"; data: Record<string, unknown>[] }> {
        const body = params && typeof params === "object" && !Array.isArray(params)
            ? params as Record<string, unknown>
            : { input: params };
        return this.client.request({
            method: "POST",
            path: `/v1/responses/${encodeURIComponent(responseId)}/input_items`,
            body,
            headers: buildCallHeaders(options, this.ctx.getWalletMaybe(), this.ctx.getTokenMaybe()),
            signal: options?.signal,
            timeoutMs: options?.timeoutMs,
        });
    }

    async cancel(responseId: string, options?: CallOptions): Promise<ResponseObject> {
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
    options: CallOptions | undefined,
): AsyncGenerator<ModelEvent, ResponsesStreamFinalResult, void> {
    const timeoutController = new AbortController();
    const timeoutMs = options?.timeoutMs ?? 10 * 60 * 1000;
    const timer = setTimeout(() => timeoutController.abort(), timeoutMs);
    const requestSignal = mergeSignals(options?.signal, timeoutController.signal);

    let response: Response;
    try {
        response = await requestResponseWithPayment<unknown>(client, ctx, {
            method: "POST",
            path: "/v1/responses",
            body: { ...cleanse(params), stream: true },
            headers: buildCallHeaders(options, ctx.getWalletMaybe(), ctx.getTokenMaybe()),
            signal: requestSignal.signal,
            timeoutMs,
            expectStream: true,
        }, options);
    } catch (fetchError) {
        requestSignal.cleanup();
        clearTimeout(timer);
        throw fetchError;
    }

    if (!response.body) {
        throw new Error({ code: "upstream_error", message: "Streaming response had no body" });
    }

    let receipt: Receipt | null = null;
    let lastCompleted: WireResponseStreamEvent | null = null;
    let streamError: Error | null = null;
    let sawDone = false;
    let created: ResponseObject | null = null;
    let textOutput = "";
    const outputItems: ResponseOutputItem[] = [];
    const toolCallAggregator = new Map<string, { id: string; name: string; arguments: string; index: number }>();
    const toolCallIndexKeys = new Map<number, string>();

    try {
        for await (const frame of parseSSEStream(response.body, { signal: requestSignal.signal })) {
            if (isReceiptEvent(frame.event)) {
                try { receipt = parseReceiptEvent(frame.data); } catch { /* ignore */ }
                continue;
            }
            if (frame.event === "compose.error") {
                try {
                    const parsed = JSON.parse(frame.data) as { code?: string; message?: string };
                    streamError = new Error({
                        code: (parsed.code as never) ?? "upstream_error",
                        message: parsed.message ?? "Stream error",
                    });
                } catch { /* ignore */ }
                const decoded = decodeModelEvent(frame, { runId: options?.composeRunId });
                if (decoded) yield decoded;
                continue;
            }
            if (frame.data === "[DONE]") {
                sawDone = true;
                continue;
            }
            if (sawDone) continue;
            if (frame.event !== "message") continue;

            let parsed: WireResponseStreamEvent;
            try {
                parsed = JSON.parse(frame.data) as WireResponseStreamEvent;
            } catch {
                continue;
            }

            if (parsed.type === "response.created") {
                created = parsed.response;
            }

            if (parsed.type === "response.output_text.delta") {
                textOutput += parsed.delta;
            }

            if (parsed.type === "response.image_generation_call.completed") {
                const url = `data:${parsed.mime_type || "image/png"};base64,${parsed.image_b64}`;
                outputItems.push({
                    type: "output_image",
                    role: "assistant",
                    image_url: url,
                    mime_type: parsed.mime_type || "image/png",
                    ...(parsed.revised_prompt ? { text: parsed.revised_prompt } : {}),
                });
            }

            if (parsed.type === "response.output_item.completed") {
                outputItems[parsed.output_index] = parsed.item;
            }

            if (parsed.type === "response.output_video.status" && parsed.status === "completed" && parsed.url) {
                const existingIndex = outputItems.findIndex((item) => item.type === "output_video" && item.job_id === parsed.job_id);
                const item: ResponseOutputItem = {
                    type: "output_video",
                    role: "assistant",
                    job_id: parsed.job_id,
                    status: parsed.status,
                    video_url: parsed.url,
                    ...(typeof parsed.progress === "number" ? { progress: parsed.progress } : {}),
                };
                if (existingIndex >= 0) outputItems[existingIndex] = { ...outputItems[existingIndex], ...item };
                else outputItems.push(item);
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
                    const previousKey = toolCallIndexKeys.get(idx) ?? String(idx);
                    const key = delta.id ?? previousKey;
                    const existing = toolCallAggregator.get(key)
                        ?? (delta.id ? toolCallAggregator.get(previousKey) : undefined)
                        ?? {
                        id: delta.id ?? `call_${idx}`,
                        name: "",
                        arguments: "",
                        index: idx,
                    };
                    if (delta.id) existing.id = delta.id;
                    if (delta.name) existing.name += delta.name;
                    if (delta.arguments) existing.arguments += delta.arguments;
                    toolCallAggregator.set(key, existing);
                    if (delta.id) {
                        toolCallIndexKeys.set(idx, key);
                        if (previousKey !== key) toolCallAggregator.delete(previousKey);
                    }
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
            const responseId = "response_id" in parsed ? parsed.response_id : "response" in parsed ? parsed.response.id : undefined;
            const model = "model" in parsed ? parsed.model : "response" in parsed ? parsed.response.model : undefined;
            const decoded = decodeModelEvent(parsed, { runId: options?.composeRunId, responseId, model });
            if (decoded) yield decoded;
        }

        if (streamError) throw streamError;

        const compactOutput = outputItems.filter((item): item is ResponseOutputItem => Boolean(item));
        if (textOutput && !compactOutput.some((item) => item.type === "output_text")) {
            compactOutput.unshift({ type: "output_text", role: "assistant", text: textOutput });
        }

        const finalResponse: ResponseObject | null = lastCompleted
            ? {
                id: lastCompleted.response_id,
                object: "response",
                created_at: created?.created_at ?? Math.floor(Date.now() / 1000),
                status: "completed",
                model: lastCompleted.model,
                output: compactOutput,
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
            : created
                ? { ...created, output: compactOutput }
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
        clearTimeout(timer);
        requestSignal.cleanup();
        try { response.body?.cancel(); } catch { /* best-effort */ }
    }
}


// ---------------------------------------------------------------------------
// Top-level inference resource
// ---------------------------------------------------------------------------

export class InferenceResource {
    readonly responses: ResponsesNamespace;

    constructor(
        client: HttpClient,
        ctx: InferenceContext,
    ) {
        this.responses = new ResponsesNamespace(client, ctx);
    }
}

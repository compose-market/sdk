/**
 * HTTP client core for the Compose Market SDK.
 *
 * Responsibilities:
 *   - Build canonical headers (Authorization / x-session-user-address / x-chain-id /
 *     PAYMENT-SIGNATURE / x-x402-max-amount-wei / x-idempotency-key / User-Agent).
 *   - Apply retries with exponential backoff + jitter (default 2 retries, honor
 *     Retry-After).
 *   - Attach an AbortSignal for caller-driven cancellation and an internal
 *     timeout.
 *   - Parse error envelopes + PaymentRequired into typed error classes.
 *   - Return an `APIPromise<T>` that exposes `.asResponse()` and `.withResponse()`
 *     so callers can read headers (receipts, request-id, tx hash) without parsing.
 *
 * Zero runtime dependencies. Uses the platform `fetch`.
 */

import {
    BadRequestError,
    buildApiError,
    ComposeConnectionError,
    ComposeError,
    ComposeTimeoutError,
    RateLimitError,
} from "./errors.js";
import type {
    ComposeErrorCode,
    ComposeErrorEnvelope,
    PaymentRequired,
} from "./types/index.js";

export type FetchLike = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>;

export interface RetryPolicy {
    maxRetries: number;
    initialDelayMs: number;
    maxDelayMs: number;
    jitter: boolean;
}

export interface HttpClientOptions {
    baseUrl: string;
    fetch: FetchLike;
    timeoutMs: number;
    defaultHeaders: Record<string, string>;
    retry: RetryPolicy;
    userAgent: string;
    logger?: {
        debug?: (msg: string, meta?: Record<string, unknown>) => void;
        warn?: (msg: string, meta?: Record<string, unknown>) => void;
        error?: (msg: string, meta?: Record<string, unknown>) => void;
    };
}

export interface HeaderBagInput {
    authJwt?: string;
    composeKey?: string | null;
    userAddress?: string | null;
    chainId?: number | null;
    paymentSignature?: string;
    x402MaxAmountWei?: string;
    idempotencyKey?: string;
    composeRunId?: string;
    requestId?: string;
    extra?: Record<string, string | undefined>;
}

export interface RequestOptions {
    method: string;
    path: string;
    query?: Record<string, string | number | boolean | null | undefined>;
    body?: unknown;
    bodyType?: "json" | "form-data" | "raw";
    rawBody?: BodyInit;
    headers?: HeaderBagInput;
    /** Override for streaming responses — skip JSON parsing. */
    expectStream?: boolean;
    signal?: AbortSignal;
    /** Caller-provided per-call timeout (ms). */
    timeoutMs?: number;
    /** Caller-provided per-call retry policy. */
    retry?: Partial<RetryPolicy>;
    /**
     * Treat this call as NOT retryable on network errors; useful for non-
     * idempotent mutations the caller knows should only be attempted once.
     */
    doNotRetry?: boolean;
}

export interface APIPromise<T> extends PromiseLike<T> {
    /** Return the raw `Response` without consuming the body. */
    asResponse(): Promise<Response>;
    /** Return `{ data, response }` with the parsed body and raw response. */
    withResponse(): Promise<{ data: T; response: Response }>;
    /** Standard promise `catch`. */
    catch<TResult = never>(onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null): Promise<T | TResult>;
    /** Standard promise `finally`. */
    finally(onfinally?: (() => void) | null): Promise<T>;
}

const RETRYABLE_STATUSES = new Set([408, 409, 425, 429, 500, 502, 503, 504]);

function delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            signal?.removeEventListener("abort", onAbort);
            resolve();
        }, ms);
        const onAbort = () => {
            clearTimeout(timer);
            reject(new ComposeTimeoutError({ message: "request aborted" }));
        };
        if (signal) {
            if (signal.aborted) {
                clearTimeout(timer);
                reject(new ComposeTimeoutError({ message: "request aborted" }));
                return;
            }
            signal.addEventListener("abort", onAbort, { once: true });
        }
    });
}

function combineSignals(a?: AbortSignal, b?: AbortSignal): AbortSignal {
    if (!a) return b ?? new AbortController().signal;
    if (!b) return a;
    const controller = new AbortController();
    const forward = () => controller.abort();
    if (a.aborted || b.aborted) controller.abort();
    a.addEventListener("abort", forward, { once: true });
    b.addEventListener("abort", forward, { once: true });
    return controller.signal;
}

function buildQueryString(query: RequestOptions["query"]): string {
    if (!query) return "";
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value === undefined || value === null) continue;
        params.append(key, String(value));
    }
    const encoded = params.toString();
    return encoded.length > 0 ? `?${encoded}` : "";
}

function normalizeUserAddress(value: string): string {
    const trimmed = value.trim().toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(trimmed)) {
        throw new BadRequestError({ message: "userAddress must be a valid 0x-prefixed EVM address" });
    }
    return trimmed;
}

function normalizeAtomicAmount(value: string, fieldName: string): string {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed) || BigInt(trimmed) <= 0n) {
        throw new BadRequestError({ message: `${fieldName} must be a positive integer string` });
    }
    return trimmed.replace(/^0+(?=\d)/, "");
}

export function buildHeaders(input: HeaderBagInput & {
    defaultHeaders: Record<string, string>;
    userAgent: string;
    bodyType?: "json" | "form-data" | "raw";
}): Headers {
    const headers = new Headers();
    for (const [key, value] of Object.entries(input.defaultHeaders)) {
        headers.set(key, value);
    }

    if (input.bodyType === "json") {
        headers.set("Content-Type", "application/json");
    }
    // For "form-data" we let the runtime set the multipart boundary; we do not
    // set Content-Type manually. For "raw" the caller sets it.

    if (input.authJwt) {
        headers.set("Authorization", `Bearer ${input.authJwt}`);
    } else if (input.composeKey) {
        headers.set("Authorization", `Bearer ${input.composeKey}`);
    }

    if (input.userAddress) {
        headers.set("x-session-user-address", normalizeUserAddress(input.userAddress));
    }

    if (typeof input.chainId === "number" && Number.isInteger(input.chainId) && input.chainId > 0) {
        headers.set("x-chain-id", String(input.chainId));
    }

    if (input.paymentSignature) {
        headers.set("PAYMENT-SIGNATURE", input.paymentSignature);
    }

    if (input.x402MaxAmountWei) {
        headers.set("x-x402-max-amount-wei", normalizeAtomicAmount(input.x402MaxAmountWei, "x402MaxAmountWei"));
    }

    if (input.idempotencyKey) {
        headers.set("x-idempotency-key", input.idempotencyKey);
    }

    if (input.composeRunId) {
        headers.set("x-compose-run-id", input.composeRunId);
    }

    if (input.requestId) {
        headers.set("x-request-id", input.requestId);
    }

    headers.set("User-Agent", input.userAgent);

    if (input.extra) {
        for (const [key, value] of Object.entries(input.extra)) {
            if (typeof value === "string" && value.length > 0) {
                headers.set(key, value);
            }
        }
    }

    return headers;
}

function parseErrorBody(body: unknown): { code: ComposeErrorCode; message: string; details?: Record<string, unknown> } {
    if (body && typeof body === "object") {
        const envelope = body as ComposeErrorEnvelope;
        if (envelope.error && typeof envelope.error === "object") {
            return {
                code: (envelope.error.code as ComposeErrorCode) || "internal_error",
                message: typeof envelope.error.message === "string" ? envelope.error.message : "Request failed",
                details: envelope.error.details,
            };
        }
        // Raw PaymentRequired body served directly as the 402 body (the x402
        // core facilitator spec shape). Infer `payment_required` as the code.
        const pr = body as Record<string, unknown>;
        if (pr.x402Version === 2 && Array.isArray(pr.accepts)) {
            const rawError = typeof pr.error === "string" ? pr.error : "Payment required";
            return { code: "payment_required" as ComposeErrorCode, message: rawError };
        }
        // Legacy shapes
        const legacy = body as Record<string, unknown>;
        if (typeof legacy.error === "string") {
            return { code: (typeof legacy.code === "string" ? legacy.code : "internal_error") as ComposeErrorCode, message: legacy.error };
        }
        if (typeof legacy.message === "string") {
            return { code: "internal_error" as ComposeErrorCode, message: legacy.message };
        }
    }
    return { code: "internal_error" as ComposeErrorCode, message: "Request failed" };
}

function extractPaymentRequired(body: unknown, header: string | null): PaymentRequired | null {
    if (typeof header === "string" && header.length > 0) {
        try {
            const normalized = header.replace(/-/g, "+").replace(/_/g, "/");
            const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
            const decoded = typeof globalThis.atob === "function"
                ? globalThis.atob(normalized + padding)
                : Buffer.from(normalized + padding, "base64").toString("utf-8");
            const bytes = new Uint8Array(decoded.length);
            for (let i = 0; i < decoded.length; i += 1) bytes[i] = decoded.charCodeAt(i);
            const text = new TextDecoder("utf-8").decode(bytes);
            const parsed = JSON.parse(text) as PaymentRequired;
            if (parsed && parsed.x402Version === 2 && Array.isArray(parsed.accepts)) {
                return parsed;
            }
        } catch {
            // fall through
        }
    }

    if (body && typeof body === "object") {
        const record = body as Record<string, unknown>;
        if (record.x402Version === 2 && Array.isArray(record.accepts) && record.resource) {
            return record as unknown as PaymentRequired;
        }
    }

    return null;
}

export class HttpClient {
    private readonly options: HttpClientOptions;

    constructor(options: HttpClientOptions) {
        this.options = options;
    }

    request<T>(config: RequestOptions): APIPromise<T> {
        // The promise is built lazily and backed by one network execution.
        // Parsing uses a cloned response, so `.withResponse()` can expose the
        // original response without forcing a second paid request.
        let cachedResponse: Promise<Response> | null = null;
        let cachedParsed: Promise<{ data: T; response: Response }> | null = null;

        const runResponse = (): Promise<Response> => {
            if (!cachedResponse) cachedResponse = this.executeRaw(config);
            return cachedResponse;
        };
        const runParsed = (): Promise<{ data: T; response: Response }> => {
            if (!cachedParsed) {
                cachedParsed = (async () => {
                    const response = await runResponse();
                    const data = config.expectStream
                        ? (undefined as unknown as T)
                        : await this.parseResponseBody<T>(response.clone());
                    return { data, response };
                })();
            }
            return cachedParsed;
        };

        const wrapper: APIPromise<T> = {
            then: (onFulfilled, onRejected) => runParsed().then(({ data }) => data).then(onFulfilled, onRejected),
            catch: (onRejected) => runParsed().then(({ data }) => data).catch(onRejected),
            finally: (onFinally) => runParsed().then(({ data }) => data).finally(onFinally),
            asResponse: async (): Promise<Response> => runResponse(),
            withResponse: async (): Promise<{ data: T; response: Response }> => runParsed(),
        };

        return wrapper;
    }

    private async executeRaw(config: RequestOptions): Promise<Response> {
        const query = buildQueryString(config.query);
        const url = `${this.options.baseUrl}${config.path}${query}`;
        const bodyType: "json" | "form-data" | "raw" = config.bodyType
            ?? (config.rawBody !== undefined ? "raw" : "json");

        const retry = { ...this.options.retry, ...(config.retry ?? {}) };
        const timeoutMs = config.timeoutMs ?? this.options.timeoutMs;

        const headers = buildHeaders({
            ...(config.headers ?? {}),
            defaultHeaders: this.options.defaultHeaders,
            userAgent: this.options.userAgent,
            bodyType,
        });

        const body = this.encodeBody(config, bodyType);

        let attempt = 0;
        let lastError: ComposeError | null = null;

        while (true) {
            attempt += 1;
            const attemptController = new AbortController();
            const timeoutHandle = setTimeout(() => attemptController.abort(), timeoutMs);
            const signal = combineSignals(config.signal, attemptController.signal);

            let response: Response;
            try {
                response = await this.options.fetch(url, {
                    method: config.method,
                    headers,
                    body,
                    signal,
                });
            } catch (fetchError) {
                clearTimeout(timeoutHandle);
                const isAbort = signal.aborted || (fetchError instanceof Error && (fetchError.name === "AbortError" || fetchError.message.includes("aborted")));
                if (isAbort && config.signal?.aborted) {
                    throw new ComposeTimeoutError({ message: "request aborted" });
                }
                if (isAbort) {
                    lastError = new ComposeTimeoutError({
                        message: `request timed out after ${timeoutMs}ms`,
                    });
                } else {
                    lastError = new ComposeConnectionError({
                        message: fetchError instanceof Error ? fetchError.message : String(fetchError),
                        cause: fetchError,
                    });
                }

                if (config.doNotRetry || attempt > retry.maxRetries) throw lastError;
                await delay(this.computeBackoff(attempt, retry), config.signal);
                continue;
            }

            clearTimeout(timeoutHandle);

            if (response.ok) {
                return response;
            }

            const errorBody = await this.safeReadJson(response);
            const parsed = parseErrorBody(errorBody);
            const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id") ?? undefined;
            const retryAfterHeader = response.headers.get("retry-after");
            const retryAfter = retryAfterHeader ? Math.max(0, parseInt(retryAfterHeader, 10)) : undefined;
            const paymentRequired = response.status === 402
                ? extractPaymentRequired(errorBody, response.headers.get("payment-required") ?? response.headers.get("PAYMENT-REQUIRED"))
                : null;
            const apiError = buildApiError({
                status: response.status,
                code: parsed.code,
                message: parsed.message,
                details: parsed.details,
                requestId: requestId ?? undefined,
                headers: headersToRecord(response.headers),
                body: errorBody,
                paymentRequired,
                paymentRequiredHeader: response.headers.get("payment-required") ?? response.headers.get("PAYMENT-REQUIRED"),
                retryAfter,
            });

            const isRetryable = RETRYABLE_STATUSES.has(response.status) && !config.doNotRetry;
            if (isRetryable && attempt <= retry.maxRetries) {
                const wait = apiError instanceof RateLimitError && apiError.retryAfter
                    ? apiError.retryAfter * 1000
                    : this.computeBackoff(attempt, retry);
                await delay(wait, config.signal);
                continue;
            }

            throw apiError;
        }
    }

    private computeBackoff(attempt: number, retry: RetryPolicy): number {
        const base = Math.min(retry.initialDelayMs * (2 ** (attempt - 1)), retry.maxDelayMs);
        if (!retry.jitter) return base;
        // Full jitter — uniformly between 0 and base.
        return Math.random() * base;
    }

    private encodeBody(config: RequestOptions, bodyType: "json" | "form-data" | "raw"): BodyInit | undefined {
        if (config.method === "GET" || config.method === "HEAD") return undefined;
        if (config.rawBody !== undefined) return config.rawBody;
        if (bodyType === "json" && config.body !== undefined) return JSON.stringify(config.body);
        return undefined;
    }

    private async parseResponseBody<T>(response: Response): Promise<T> {
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const text = await response.text();
            if (!text) return undefined as unknown as T;
            return JSON.parse(text) as T;
        }
        if (contentType.startsWith("text/")) {
            return (await response.text()) as unknown as T;
        }
        // Binary responses (audio/speech, etc.) return the raw Response via
        // asResponse(); the generic T is set to undefined for callers who do
        // not ask for the Response directly.
        return undefined as unknown as T;
    }

    private async safeReadJson(response: Response): Promise<unknown> {
        try {
            const text = await response.text();
            if (!text) return null;
            try {
                return JSON.parse(text);
            } catch {
                return text;
            }
        } catch {
            return null;
        }
    }
}

function headersToRecord(headers: Headers): Record<string, string> {
    const record: Record<string, string> = {};
    headers.forEach((value, key) => {
        record[key] = value;
    });
    return record;
}

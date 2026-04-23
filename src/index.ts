/**
 * `@compose-market/sdk` — Official SDK for Compose Market.
 *
 * Exposes the canonical header contract (`Authorization: Bearer compose-<jwt>`,
 * `x-session-user-address`, `x-chain-id`) that powers Compose's first-party
 * apps (web/, mesh/) and lets any third-party integrator embed:
 *
 *   - Compose Key lifecycle (create / list / get / revoke, session metadata)
 *   - 45k+ model catalog (list / listAll / search / get / getParams)
 *   - OpenAI-shaped inference (chat.completions, responses, embeddings, images,
 *     audio.speech, audio.transcriptions, videos) with full SSE streaming,
 *     typed tool-call deltas and reasoning deltas, typed cost receipts, and
 *     live session-budget updates emitted on every response.
 *   - x402 facilitator access (supported / chains / verify / settle) and typed
 *     decoders for PAYMENT-REQUIRED, PAYMENT-RESPONSE, X-Compose-Receipt.
 *   - SSE session events (`sdk.session.events`) for budget depletion and
 *     expiry notifications, dispatched on the typed event bus as well.
 *   - Webhook signature verification (HMAC-SHA256, Stripe-style header).
 *
 * Design:
 *   - Zero runtime dependencies. Uses platform `fetch`, WebCrypto, TextDecoder,
 *     ReadableStream. Works in Node 20+, Bun, Deno, Cloudflare Workers, browsers.
 *   - Identity is whatever the integrator already has. The SDK does NOT call a
 *     wallet, does NOT request signatures, does NOT run KYC. The end-user's
 *     wallet address — produced by whatever auth stack the integrator already
 *     uses — is trusted in the same exact way our first-party apps trust it —
 *     via the `x-session-user-address` header. The Compose Key JWT returned by
 *     `keys.create(...)` is the real cryptographic identity from that point on.
 *   - Every billable call returns a `ComposeCompletion<T>` carrying the parsed
 *     body, the settlement receipt (if any), the request id, the live session
 *     budget snapshot, the session-invalid reason (if any), and the raw
 *     Response so integrators can read non-standard headers without parsing.
 *   - Persisted session tokens survive page reloads when a storage adapter is
 *     provided (browser `localStorage` is auto-detected).
 */

import { HttpClient, type FetchLike, type HttpClientOptions, type RetryPolicy } from "./http.js";
import { KeysResource } from "./resources/keys.js";
import { ModelsResource } from "./resources/models.js";
import { InferenceResource } from "./resources/inference.js";
import { X402Resource } from "./resources/x402.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { SessionEventsResource, type SessionEventsOptions } from "./resources/session-events.js";
import { AgentResource } from "./resources/agent.js";
import { WorkflowResource } from "./resources/workflow.js";
import { instrumentBillableResponse } from "./resources/instrumentation.js";
import { BadRequestError } from "./errors.js";
import { createEventBus, type ComposeEventBus, type ComposeEventName, type ComposeEventListener } from "./events.js";
import {
    resolveStorage,
    createMemoryStorage,
    buildTokenStorageKey,
    DEFAULT_TOKEN_SCOPE,
    type ComposeStorage,
} from "./storage.js";
import { SDK_VERSION } from "./version.js";

export * from "./types/index.js";
export * from "./errors.js";
export type {
    APIPromise,
    HeaderBagInput,
    HttpClientOptions,
    RequestOptions,
    RetryPolicy,
} from "./http.js";
export type {
    ComposeCallOptions,
    ComposeCompletion,
    ChatCompletionFinalResult,
    ResponsesStreamFinalResult,
    ComposeStreamIterator,
    InferenceContext,
} from "./resources/inference.js";
export type {
    ComposeWebhookEvent,
    VerifyWebhookInput,
} from "./resources/webhooks.js";
export type {
    BudgetEvent,
    ComposeEventBus,
    ComposeEventListener,
    ComposeEventMap,
    ComposeEventName,
    ReceiptEvent,
    SessionInvalidEvent,
    ToolCallLifecycleEvent,
    AgentStreamLifecycleEvent,
    WorkflowStreamLifecycleEvent,
} from "./events.js";
export type { ComposeStorage } from "./storage.js";
export type { SessionEventsOptions } from "./resources/session-events.js";
export type { AgentResource } from "./resources/agent.js";
export type { WorkflowResource } from "./resources/workflow.js";

export { decodeReceiptHeader, extractReceiptFromResponse, parseReceiptEvent } from "./streaming/receipt.js";
export { parseSSEStream } from "./streaming/sse.js";
export { extractSessionBudgetFromResponse } from "./streaming/budget.js";
export { createMemoryStorage } from "./storage.js";

/**
 * Constructor options for `ComposeSDK`.
 */
export interface ComposeSDKOptions {
    /** API base URL. Defaults to `https://api.compose.market`. */
    baseUrl?: string;
    /** Custom fetch implementation. Defaults to the global `fetch`. */
    fetch?: FetchLike;
    /**
     * End-user wallet address. Whatever identity stack you already use produced
     * this address — pass it through. The SDK relays it exactly as our
     * first-party apps do, and does not care how you obtained it.
     */
    userAddress?: string;
    /**
     * Chain id. Must be one of the facilitator-configured chains. Call
     * `sdk.x402.facilitator.chains()` to enumerate supported chains + USDC
     * contracts at runtime.
     */
    chainId?: number;
    /**
     * A previously-issued Compose Key JWT. The SDK stores this in-memory and
     * attaches it as `Authorization: Bearer compose-<jwt>` on every call.
     *
     * When a `storage` adapter is present, the token is also persisted under
     * the scoped key `<tokenScope>:<address>:<chainId>` so that it survives
     * page reloads. If `composeKey` is omitted at construction, the SDK
     * attempts to hydrate from storage.
     */
    composeKey?: string;
    /** Default timeout for each HTTP call, in milliseconds. Default 60_000. */
    timeoutMs?: number;
    /** Retry policy applied to transient errors (5xx, 429, network). */
    retry?: Partial<RetryPolicy>;
    /** Headers merged into every request. */
    defaultHeaders?: Record<string, string>;
    /**
     * `User-Agent` suffix so Compose analytics can distinguish integrators.
     * The base string is `@compose-market/sdk/<version>`.
     */
    userAgent?: string;
    /** Optional debug/logging hooks. */
    logger?: HttpClientOptions["logger"];
    /**
     * Pluggable persistent storage. Auto-detects `globalThis.localStorage` on
     * browsers/Workers. Pass an explicit adapter on Node/server runtimes if
     * you want the session token to survive process restarts.
     */
    storage?: ComposeStorage;
    /**
     * Namespace prefix for persisted tokens. The full key shape is
     * `<tokenScope>:<lower-address>:<chainId>`. Defaults to
     * `compose.sdk.token`. Bump this only if you need to invalidate every
     * persisted token at once (e.g. after a breaking server auth change).
     */
    tokenScope?: string;
}

const DEFAULT_RETRY: RetryPolicy = {
    maxRetries: 2,
    initialDelayMs: 500,
    maxDelayMs: 8_000,
    jitter: true,
};

function normalizeBaseUrl(value: string | undefined): string {
    return (value || "https://api.compose.market").replace(/\/+$/, "");
}

function normalizeUserAddress(value: string): string {
    const trimmed = value.trim().toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(trimmed)) {
        throw new BadRequestError({ message: "userAddress must be a valid 0x-prefixed EVM address" });
    }
    return trimmed;
}

function normalizeChainId(value: number | undefined | null): number | null {
    if (value === undefined || value === null) return null;
    if (!Number.isInteger(value) || value <= 0) {
        throw new BadRequestError({ message: "chainId must be a positive integer" });
    }
    return value;
}

export class ComposeSDK {
    /** The SDK version, sourced from package.json at build time. */
    readonly version: string = SDK_VERSION;

    /** Resolved API base URL, trimmed of trailing slashes. */
    readonly baseUrl: string;

    readonly keys: KeysResource;
    readonly models: ModelsResource;
    readonly inference: InferenceResource;
    readonly x402: X402Resource;
    readonly webhooks: WebhooksResource;
    readonly session: SessionEventsNamespace;
    readonly agent: AgentResource;
    readonly workflow: WorkflowResource;

    readonly wallets: {
        attach: (input: { address: string; chainId: number }) => void;
        current: () => { address: string | null; chainId: number | null };
        clear: () => void;
    };

    /**
     * Typed, in-memory event bus. Listeners registered here receive:
     *   - `budget`         — live `x-session-budget-*` snapshot on every billable call.
     *   - `sessionInvalid` — `x-compose-session-invalid` header set by the server.
     *   - `sessionActive`  — SSE `session-active` heartbeat from `/api/session/events`.
     *   - `sessionExpired` — SSE `session-expired` frame from `/api/session/events`.
     *   - `receipt`        — settlement receipt on every billable response / stream.
     */
    readonly events: ComposeEventBus;

    private readonly http: HttpClient;
    private readonly storage: ComposeStorage;
    private readonly tokenScope: string;
    private userAddress: string | null;
    private chainId: number | null;
    private composeKey: string | null;
    private readonly rawFetch: FetchLike;
    private readonly userAgent: string;

    constructor(options: ComposeSDKOptions = {}) {
        this.userAddress = options.userAddress ? normalizeUserAddress(options.userAddress) : null;
        this.chainId = normalizeChainId(options.chainId);
        this.baseUrl = normalizeBaseUrl(options.baseUrl);
        this.tokenScope = options.tokenScope ?? DEFAULT_TOKEN_SCOPE;
        this.storage = resolveStorage(options.storage) ?? createMemoryStorage();

        this.events = createEventBus({ logger: options.logger });

        // Seed `composeKey` in this priority:
        //   1. explicit constructor option
        //   2. persistent storage scoped to (address, chainId) if both known
        //   3. null
        if (options.composeKey) {
            this.composeKey = options.composeKey;
            this.persistToken(options.composeKey);
        } else if (this.userAddress && this.chainId !== null) {
            this.composeKey = this.storage.getItem(
                buildTokenStorageKey(this.tokenScope, this.userAddress, this.chainId),
            );
        } else {
            this.composeKey = null;
        }

        const userAgent = options.userAgent
            ? `@compose-market/sdk/${SDK_VERSION} ${options.userAgent}`
            : `@compose-market/sdk/${SDK_VERSION}`;

        this.rawFetch = options.fetch ?? globalThis.fetch.bind(globalThis);
        this.userAgent = userAgent;

        this.http = new HttpClient({
            baseUrl: this.baseUrl,
            fetch: this.rawFetch,
            timeoutMs: options.timeoutMs ?? 60_000,
            defaultHeaders: { ...(options.defaultHeaders ?? {}) },
            retry: { ...DEFAULT_RETRY, ...(options.retry ?? {}) },
            userAgent,
            logger: options.logger,
        });

        this.wallets = {
            attach: (input) => {
                this.userAddress = normalizeUserAddress(input.address);
                this.chainId = normalizeChainId(input.chainId);
                // Re-hydrate persisted token for the freshly-attached wallet.
                const stored = this.storage.getItem(
                    buildTokenStorageKey(this.tokenScope, this.userAddress, this.chainId!),
                );
                if (stored) this.composeKey = stored;
            },
            current: () => ({ address: this.userAddress, chainId: this.chainId }),
            clear: () => {
                this.userAddress = null;
                this.chainId = null;
                this.composeKey = null;
            },
        };

        const getWallet = (): { address: string; chainId: number } => {
            if (!this.userAddress) {
                throw new BadRequestError({
                    message: "Wallet context is required. Call sdk.wallets.attach({ address, chainId }) first, or pass userAddress + chainId to the constructor.",
                });
            }
            if (this.chainId === null) {
                throw new BadRequestError({
                    message: "chainId is required. Call sdk.wallets.attach(...) or pass chainId to the constructor.",
                });
            }
            return { address: this.userAddress, chainId: this.chainId };
        };
        const getWalletMaybe = (): { address: string | null; chainId: number | null } => ({
            address: this.userAddress,
            chainId: this.chainId,
        });

        this.keys = new KeysResource(this.http, {
            getWallet,
            getWalletMaybe,
            setToken: (token) => {
                this.composeKey = token;
                this.persistToken(token);
            },
            getToken: () => this.composeKey,
            clearToken: () => {
                this.composeKey = null;
                this.deletePersistedToken();
            },
        });
        this.models = new ModelsResource(this.http);
        this.inference = new InferenceResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
            events: this.events,
        });
        this.x402 = new X402Resource(this.http);
        this.webhooks = new WebhooksResource();
        this.session = new SessionEventsNamespace(
            new SessionEventsResource(this.http, this.events),
            getWalletMaybe,
        );

        const agentWorkflowContext = {
            baseUrl: this.baseUrl,
            fetch: this.rawFetch,
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
            events: this.events,
            userAgent,
        };
        this.agent = new AgentResource(agentWorkflowContext);
        this.workflow = new WorkflowResource(agentWorkflowContext);
    }

    private persistToken(token: string): void {
        if (!this.userAddress || this.chainId === null) return;
        this.storage.setItem(
            buildTokenStorageKey(this.tokenScope, this.userAddress, this.chainId),
            token,
        );
    }

    private deletePersistedToken(): void {
        if (!this.userAddress || this.chainId === null) return;
        this.storage.removeItem(
            buildTokenStorageKey(this.tokenScope, this.userAddress, this.chainId),
        );
    }

    /**
     * Drop-in `fetch` wrapper that attaches the canonical Compose header
     * contract (`Authorization`, `x-session-user-address`, `x-chain-id`,
     * `User-Agent`) on every request and emits `budget` / `sessionInvalid` /
     * `receipt` events on every response via the SDK event bus.
     *
     * Use this when you need to hit a Compose endpoint that isn't covered
     * by a typed resource yet (agent/workflow runtime endpoints, workspace
     * indexing, custom api/ routes). The URL may be absolute or relative to
     * the SDK's `baseUrl`.
     *
     * Non-Compose URLs (absolute URLs whose host differs from `baseUrl`) are
     * still passed through so this method is safe as a general-purpose fetch
     * replacement; the budget event extraction is a no-op when the response
     * doesn't carry `x-session-budget-*` headers.
     */
    async fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        const headers = new Headers(init?.headers);
        if (!headers.has("User-Agent")) headers.set("User-Agent", this.userAgent);
        if (this.composeKey && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${this.composeKey}`);
        }
        if (this.userAddress && !headers.has("x-session-user-address")) {
            headers.set("x-session-user-address", this.userAddress);
        }
        if (this.chainId !== null && !headers.has("x-chain-id")) {
            headers.set("x-chain-id", String(this.chainId));
        }

        // Support absolute URLs, relative paths, and Request objects alike.
        let resolvedInput: RequestInfo | URL = input;
        if (typeof input === "string") {
            resolvedInput = input.startsWith("http://") || input.startsWith("https://")
                ? input
                : `${this.baseUrl}${input.startsWith("/") ? input : `/${input}`}`;
        }

        const response = await this.rawFetch(resolvedInput, { ...init, headers });

        // Emit budget/receipt/invalid events when the response carries the
        // relevant Compose headers. Pass `undefined` for the body since we
        // haven't read it; receipt-from-body only fires when the caller later
        // parses the JSON themselves. That's acceptable: header-based receipts
        // are the authoritative path and they're present on every billable
        // response.
        instrumentBillableResponse({ getWalletMaybe: () => ({ address: this.userAddress, chainId: this.chainId }), getTokenMaybe: () => this.composeKey, events: this.events }, response, undefined);

        return response;
    }
}

/**
 * Thin ergonomic wrapper around `SessionEventsResource` so callers write
 * `sdk.session.events({ ... })` with wallet defaults inferred from the SDK
 * instance.
 */
class SessionEventsNamespace {
    constructor(
        private readonly resource: SessionEventsResource,
        private readonly getWalletMaybe: () => { address: string | null; chainId: number | null },
    ) { }

    /**
     * Subscribe to `/api/session/events`. Yields `SessionActiveEvent` and
     * `SessionExpiredEvent` until the signal aborts or the server ends the
     * stream. The same events are also emitted on `sdk.events`.
     *
     * When `userAddress` / `chainId` are omitted, the SDK's currently attached
     * wallet context is used. Abort via an `AbortController.signal`.
     */
    subscribe(opts: Partial<SessionEventsOptions> = {}) {
        const wallet = this.getWalletMaybe();
        const userAddress = opts.userAddress ?? wallet.address;
        const chainId = opts.chainId ?? wallet.chainId;
        if (!userAddress) {
            throw new BadRequestError({
                message: "session.subscribe() needs a userAddress (either in opts or via sdk.wallets.attach).",
            });
        }
        if (chainId === null || chainId === undefined) {
            throw new BadRequestError({
                message: "session.subscribe() needs a chainId (either in opts or via sdk.wallets.attach).",
            });
        }
        return this.resource.subscribe({
            userAddress,
            chainId,
            signal: opts.signal,
            reconnectMaxDelayMs: opts.reconnectMaxDelayMs,
        });
    }

    /**
     * Shortcut: register a listener on the `sessionActive` + `sessionExpired`
     * events produced by a subscription. Returns a disposer that aborts the
     * underlying stream AND removes the listeners.
     */
    on(handlers: {
        active?: ComposeEventListener<"sessionActive">;
        expired?: ComposeEventListener<"sessionExpired">;
    }, opts: Partial<SessionEventsOptions> = {}): () => void {
        const controller = new AbortController();
        const signal = mergeAbortSignals(opts.signal, controller.signal);
        const iterable = this.subscribe({ ...opts, signal });

        const unsubActive = handlers.active
            ? (this.resource as unknown as { events: ComposeEventBus }).events.on("sessionActive" as ComposeEventName, handlers.active as ComposeEventListener<ComposeEventName>)
            : () => { /* noop */ };
        const unsubExpired = handlers.expired
            ? (this.resource as unknown as { events: ComposeEventBus }).events.on("sessionExpired" as ComposeEventName, handlers.expired as ComposeEventListener<ComposeEventName>)
            : () => { /* noop */ };

        // Drive the iterator in the background; if the caller never reads it
        // explicitly, the events still flow through the event bus.
        (async () => {
            try {
                for await (const _event of iterable) {
                    void _event;
                }
            } catch { /* aborted / retries exhausted */ }
        })();

        return () => {
            unsubActive();
            unsubExpired();
            controller.abort();
        };
    }
}

function mergeAbortSignals(a: AbortSignal | undefined, b: AbortSignal): AbortSignal {
    if (!a) return b;
    const c = new AbortController();
    const forward = () => c.abort();
    if (a.aborted || b.aborted) c.abort();
    a.addEventListener("abort", forward, { once: true });
    b.addEventListener("abort", forward, { once: true });
    return c.signal;
}

export default ComposeSDK;

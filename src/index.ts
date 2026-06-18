/**
 * `@compose-market/sdk` — Official SDK for Compose Market.
 *
 * Exposes the canonical header contract (`Authorization: Bearer compose-<jwt>`,
 * `x-session-user-address`, `x-chain-id`) that powers Compose's first-party
 * apps (web/, mesh/) and lets any third-party integrator embed:
 *
 *   - Compose Key lifecycle (create / list / get / revoke, session metadata)
 *   - Multi-provider model catalog (list / listAll / search / get / getParams)
 *   - Native inference (chat.completions, responses, embeddings, images,
 *     audio.speech, audio.transcriptions, videos) with SSE streaming,
 *     typed tool-call deltas and reasoning deltas, typed cost receipts, and
 *     live session-budget updates emitted on every response.
 *   - x402 facilitator access (supported / chains / verify / settle) and typed
 *     decoders for PAYMENT-REQUIRED, PAYMENT-RESPONSE, X-Receipt.
 *   - Agent-first runtime memory loop (`sdk.memory.context`,
 *     `sdk.memory.recordTurn`, `sdk.memory.remember`, `sdk.memory.loop`) for
 *     compact pre-turn recall, post-turn persistence, and durable facts.
 *   - SSE session events (`sdk.session.events`) for budget depletion and
 *     expiry notifications, dispatched on the typed event bus as well.
 *   - Webhook signature verification (HMAC-SHA256, Stripe-style header).
 *   - Feedback/reputation submission and summaries for x402 flows, endpoints,
 *     models, agents, and workflows without coupling feedback to settlement.
 *
 * Design:
 *   - The orchestration client uses platform `fetch`, WebCrypto, TextDecoder,
 *     and ReadableStream. Generated OpenAPI subpath clients use Speakeasy's
 *     Zod-backed runtime validation.
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

import {
    applySdkClientHeaders,
    extractPaymentRequired,
    HttpClient,
    normalizeAtomicAmount,
    type FetchLike,
    type HttpClientOptions,
    type RetryPolicy,
} from "./http.js";
import { KeysResource } from "./resources/keys.js";
import { ModelsResource } from "./resources/models.js";
import { InferenceResource } from "./resources/inference.js";
import { X402Resource } from "./resources/x402.js";
import { WebhooksResource } from "./resources/webhooks.js";
import { SessionEventsResource, type SessionEventsOptions } from "./resources/session-events.js";
import { AgentResource } from "./resources/agent.js";
import { WorkflowResource } from "./resources/workflow.js";
import { MemoryResource } from "./resources/memory.js";
import { FeedbackResource } from "./resources/feedback.js";
import { DirectoryResource } from "./resources/directory.js";
import { SystemResource } from "./resources/system.js";
import { LocalResource } from "./resources/local.js";
import { DispenserResource } from "./resources/dispenser.js";
import { SettlementResource } from "./resources/settlement.js";
import { PermissionsResource } from "./resources/permissions.js";
import { AccountsResource } from "./resources/accounts.js";
import { ChannelsResource } from "./resources/channels.js";
import { ReceiptsResource } from "./resources/receipts.js";
import { instrumentBillableResponse } from "./resources/instrumentation.js";
import { encodePaymentSignature } from "./resources/x402.js";
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
import type { X402PaymentSigner } from "./types/index.js";
import type { ComposeCallOptions } from "./resources/inference.js";

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
    StreamIterator,
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
    ChildAgentLifecycleEvent,
    AgentArtifactEvent,
    AgentHarnessPlanEvent,
    AgentStreamLifecycleEvent,
    WorkflowStreamLifecycleEvent,
} from "./events.js";
export type { ComposeStorage } from "./storage.js";
export type { SessionEventsOptions } from "./resources/session-events.js";
export type { AgentResource, RunEvent } from "./resources/agent.js";
export type { WorkflowEvent, WorkflowResource } from "./resources/workflow.js";
export type { MemoryResource } from "./resources/memory.js";
export type { FeedbackResource } from "./resources/feedback.js";
export type { DirectoryResource } from "./resources/directory.js";
export type { SystemResource } from "./resources/system.js";
export type { LocalResource } from "./resources/local.js";
export type { DispenserResource } from "./resources/dispenser.js";
export type { SettlementResource } from "./resources/settlement.js";
export type { PermissionsResource } from "./resources/permissions.js";
export type { AccountsResource } from "./resources/accounts.js";
export type { ChannelsResource } from "./resources/channels.js";
export type { ReceiptsResource, ReceiptListOptions } from "./resources/receipts.js";

export { decodeReceiptHeader, extractReceiptFromResponse, parseReceiptEvent } from "./streaming/receipt.js";
export { parseSSEStream, parse, format, named, done } from "@compose-market/core/transport";
export type { Frame, SSEFrame } from "@compose-market/core/transport";
export {
    create as createModelState,
    decode as decodeModelEvent,
    reduce as reduceModelState,
} from "@compose-market/core/model";
export type {
    AssetKind,
    ModelAsset,
    ModelEvent,
    ModelState,
    ModelStatus,
} from "@compose-market/core/model";
export {
    create as createActivityState,
    decode as decodeActivityEvent,
    reduce as reduceActivityState,
} from "@compose-market/core/activity";
export type {
    ActivityEvent,
    ActivityKind,
    ActivityNode,
    ActivityState,
    ActivityStatus,
    ActivityTarget,
} from "@compose-market/core/activity";
export { extractSessionBudgetFromResponse } from "./streaming/budget.js";
export {
    createPrivateKeyX402EvmSigner,
    createPrivateKeyX402EvmWallet,
    createX402EvmSigner,
    encodePaymentPayload,
    encodePaymentSignature,
} from "./resources/x402.js";
export { createMemoryStorage } from "./storage.js";

/**
 * Constructor options for `ComposeSDK`.
 */
export interface ComposeSDKOptions {
    /** API base URL. Defaults to `https://api.compose.market`. */
    baseUrl?: string;
    /** Channels service URL. Defaults to `https://services.compose.market`. */
    channelsUrl?: string;
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
    /**
     * Provider-agnostic x402 signer. The SDK calls this only after receiving a
     * real PAYMENT-REQUIRED challenge, then retries the request with the
     * returned PAYMENT-SIGNATURE. Integrators can back this with Thirdweb,
     * Privy, Dynamic, a browser wallet, a server wallet, or any other signer.
     */
    x402Signer?: X402PaymentSigner;
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

function normalizeChannelsUrl(value: string | undefined): string {
    return (value || "https://services.compose.market").replace(/\/+$/, "");
}

function channelHeaders(headers: Record<string, string> | undefined): Record<string, string> {
    const blocked = new Set([
        "authorization",
        "payment-signature",
        "x-chain-id",
        "x-run-id",
        "x-session-user-address",
        "x-x402-max-amount-wei",
        "x-idempotency-key",
    ]);
    const kept: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers || {})) {
        const lower = key.toLowerCase();
        if (blocked.has(lower) || lower.startsWith("x-session-") || lower.startsWith("x-payment-")) {
            continue;
        }
        kept[key] = value;
    }
    return kept;
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
    /** Resolved channels service URL, trimmed of trailing slashes. */
    readonly channelsUrl: string;

    readonly keys: KeysResource;
    readonly models: ModelsResource;
    readonly inference: InferenceResource;
    readonly x402: X402Resource;
    readonly webhooks: WebhooksResource;
    readonly session: SessionEventsNamespace;
    readonly agent: AgentResource;
    readonly workflow: WorkflowResource;
    readonly memory: MemoryResource;
    readonly feedback: FeedbackResource;
    readonly directory: DirectoryResource;
    readonly system: SystemResource;
    readonly local: LocalResource;
    readonly dispenser: DispenserResource;
    readonly settlement: SettlementResource;
    readonly permissions: PermissionsResource;
    readonly accounts: AccountsResource;
    readonly channels: ChannelsResource;
    readonly receipts: ReceiptsResource;

    readonly wallets: {
        attach: (input: { address: string; chainId: number }) => void;
        current: () => { address: string | null; chainId: number | null };
        clear: () => void;
    };

    /**
     * Typed, in-memory event bus. Listeners registered here receive:
     *   - `budget`         — live `x-session-budget-*` snapshot on every billable call.
     *   - `sessionInvalid` — `x-session-invalid` header set by the server.
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
    private readonly x402Signer: X402PaymentSigner | null;
    private readonly rawFetch: FetchLike;
    private readonly userAgent: string;

    constructor(options: ComposeSDKOptions = {}) {
        this.userAddress = options.userAddress ? normalizeUserAddress(options.userAddress) : null;
        this.chainId = normalizeChainId(options.chainId);
        this.baseUrl = normalizeBaseUrl(options.baseUrl);
        this.channelsUrl = normalizeChannelsUrl(options.channelsUrl);
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
        this.x402Signer = options.x402Signer ?? null;

        this.http = new HttpClient({
            baseUrl: this.baseUrl,
            fetch: this.rawFetch,
            timeoutMs: options.timeoutMs ?? 60_000,
            defaultHeaders: { ...(options.defaultHeaders ?? {}) },
            retry: { ...DEFAULT_RETRY, ...(options.retry ?? {}) },
            userAgent,
            logger: options.logger,
        });
        const channelHttp = new HttpClient({
            baseUrl: this.channelsUrl,
            fetch: this.rawFetch,
            timeoutMs: options.timeoutMs ?? 60_000,
            defaultHeaders: channelHeaders(options.defaultHeaders),
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
            getX402SignerMaybe: () => this.x402Signer,
            events: this.events,
        });
        this.x402 = new X402Resource(
            this.http,
            {
                getWalletMaybe,
                getTokenMaybe: () => this.composeKey,
            },
            (input, init) => this.fetch(input, { ...(init ?? {}), paymentMode: "x402" } as RequestInit & ComposeCallOptions),
        );
        this.webhooks = new WebhooksResource();
        this.feedback = new FeedbackResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.directory = new DirectoryResource(this.http);
        this.system = new SystemResource(this.http);
        this.local = new LocalResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.dispenser = new DispenserResource(this.http, { getWalletMaybe });
        this.settlement = new SettlementResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.permissions = new PermissionsResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.accounts = new AccountsResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.channels = new ChannelsResource(channelHttp, {
            getWalletMaybe,
        });
        this.receipts = new ReceiptsResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
        this.session = new SessionEventsNamespace(
            new SessionEventsResource(this.http, this.events),
            getWalletMaybe,
        );

        const agentWorkflowContext = {
            baseUrl: this.baseUrl,
            fetch: this.rawFetch,
            http: this.http,
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
            getX402SignerMaybe: () => this.x402Signer,
            events: this.events,
            userAgent,
        };
        this.agent = new AgentResource(agentWorkflowContext);
        this.workflow = new WorkflowResource(agentWorkflowContext);
        this.memory = new MemoryResource(this.http, {
            getWalletMaybe,
            getTokenMaybe: () => this.composeKey,
        });
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
     * SDK client headers) on every request and emits `budget` / `sessionInvalid` /
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
    async fetch(input: RequestInfo | URL, init: RequestInit & ComposeCallOptions = {}): Promise<Response> {
        const {
            x402MaxAmountWei,
            paymentSignature,
            paymentMode = "auto",
            x402Signer,
            composeKey,
            userAddress,
            chainId,
            idempotencyKey,
            composeRunId,
            timeoutMs: _timeoutMs,
            ...fetchInit
        } = init;
        void _timeoutMs;

        const headers = new Headers(fetchInit.headers);
        const resolvedX402MaxAmountWei = x402MaxAmountWei
            ?? headers.get("x-x402-max-amount-wei")
            ?? undefined;
        const token = paymentMode === "x402"
            ? null
            : "composeKey" in init
                ? composeKey
                : this.composeKey;
        if (token && !headers.has("Authorization")) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        const resolvedUserAddress = userAddress ? normalizeUserAddress(userAddress) : this.userAddress;
        if (resolvedUserAddress && !headers.has("x-session-user-address")) {
            headers.set("x-session-user-address", resolvedUserAddress);
        }
        const resolvedChainId = chainId === undefined ? this.chainId : normalizeChainId(chainId);
        if (resolvedChainId !== null && !headers.has("x-chain-id")) {
            headers.set("x-chain-id", String(resolvedChainId));
        }
        if (paymentSignature && !headers.has("PAYMENT-SIGNATURE")) {
            headers.set("PAYMENT-SIGNATURE", encodePaymentSignature(paymentSignature));
        }
        if (resolvedX402MaxAmountWei && !headers.has("x-x402-max-amount-wei")) {
            headers.set("x-x402-max-amount-wei", normalizeAtomicAmount(resolvedX402MaxAmountWei, "x402MaxAmountWei"));
        }
        if (idempotencyKey && !headers.has("x-idempotency-key")) {
            headers.set("x-idempotency-key", idempotencyKey);
        }
        if (composeRunId && !headers.has("x-run-id")) {
            headers.set("x-run-id", composeRunId);
        }
        applySdkClientHeaders(headers, this.userAgent);

        // Support absolute URLs, relative paths, and Request objects alike.
        let resolvedInput: RequestInfo | URL = input;
        if (typeof input === "string") {
            resolvedInput = input.startsWith("http://") || input.startsWith("https://")
                ? input
                : `${this.baseUrl}${input.startsWith("/") ? input : `/${input}`}`;
        }

        const response = await this.rawFetch(resolvedInput, { ...fetchInit, headers });

        const signer = x402Signer ?? this.x402Signer;
        if (response.status === 402 && paymentMode !== "composeKey" && signer) {
            const paymentRequiredHeader = response.headers.get("payment-required") ?? response.headers.get("PAYMENT-REQUIRED");
            const paymentRequired = extractPaymentRequired(await safeReadJson(response.clone()), paymentRequiredHeader);
            if (paymentRequired) {
                const resolvedUrl = resolveUrlForFetchInput(this.baseUrl, resolvedInput);
                const signed = await signer({
                    paymentRequired,
                    paymentRequiredHeader,
                    method: resolveMethodForFetchInput(input, fetchInit),
                    path: resolvePathForSigner(this.baseUrl, resolvedUrl),
                    url: resolvedUrl,
                    body: fetchInit.body,
                    userAddress: resolvedUserAddress,
                    chainId: resolvedChainId,
                    maxAmountWei: resolvedX402MaxAmountWei
                        ? normalizeAtomicAmount(resolvedX402MaxAmountWei, "x402MaxAmountWei")
                        : undefined,
                });
                const retryHeaders = new Headers(headers);
                retryHeaders.delete("Authorization");
                retryHeaders.set("PAYMENT-SIGNATURE", encodePaymentSignature(signed));
                const retryResponse = await this.rawFetch(resolvedInput, { ...fetchInit, headers: retryHeaders });
                instrumentBillableResponse({ getWalletMaybe: () => ({ address: this.userAddress, chainId: this.chainId }), getTokenMaybe: () => this.composeKey, events: this.events }, retryResponse, undefined);
                return retryResponse;
            }
        }

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

async function safeReadJson(response: Response): Promise<unknown> {
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

function resolveUrlForFetchInput(baseUrl: string, input: RequestInfo | URL): string {
    if (typeof input === "string") return input.startsWith("http://") || input.startsWith("https://") ? input : `${baseUrl}${input.startsWith("/") ? input : `/${input}`}`;
    if (input instanceof URL) return input.toString();
    return input.url;
}

function resolvePathForSigner(baseUrl: string, resolvedUrl: string): string {
    const parsed = new URL(resolvedUrl, baseUrl);
    const base = new URL(baseUrl);
    return parsed.origin === base.origin ? `${parsed.pathname}${parsed.search}` : parsed.toString();
}

function resolveMethodForFetchInput(input: RequestInfo | URL, init: RequestInit): string {
    if (init.method) return init.method.toUpperCase();
    if (typeof input !== "string" && !(input instanceof URL)) return input.method.toUpperCase();
    return "GET";
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

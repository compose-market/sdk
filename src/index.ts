type FetchLike = typeof fetch;

export interface ComposeSDKOptions {
  baseUrl?: string;
  fetch?: FetchLike;
  walletAddress?: string;
  chainId?: number;
  composeKey?: string;
}

export interface ComposeRequestOptions {
  walletAddress?: string;
  chainId?: number;
  composeKey?: string | null;
  paymentSignature?: string;
  x402MaxAmountWei?: string;
  headers?: HeadersInit;
}

export interface PaymentRequirement {
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
  accepts: PaymentRequirement[];
  extensions?: Record<string, unknown> | null;
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

export interface ComposeKeyResponse {
  keyId: string;
  token: string;
  purpose: "session" | "api";
  budgetLimit: string;
  budgetUsed: string;
  budgetRemaining: string;
  createdAt: number;
  expiresAt: number;
  chainId: number;
  name?: string;
}

export interface ActiveComposeKeyResponse {
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

export interface ComposeKeyListItem {
  keyId: string;
  purpose: "session" | "api";
  budgetLimit: number;
  budgetUsed: number;
  budgetRemaining: number;
  createdAt: number;
  expiresAt: number;
  revokedAt?: number;
  name?: string;
  lastUsedAt?: number;
}

export interface WalletAttachment {
  address: string;
  chainId: number;
  activeKey: ActiveComposeKeyResponse;
}

export class ComposeApiError extends Error {
  readonly status: number;
  readonly body: unknown;
  readonly headers: Record<string, string>;

  constructor(input: {
    message: string;
    status: number;
    body: unknown;
    headers: Record<string, string>;
  }) {
    super(input.message);
    this.name = "ComposeApiError";
    this.status = input.status;
    this.body = input.body;
    this.headers = input.headers;
  }
}

export class ComposePaymentRequiredError extends ComposeApiError {
  readonly paymentRequired: PaymentRequired;
  readonly paymentRequiredHeader: string | null;

  constructor(input: {
    message: string;
    status: number;
    body: unknown;
    headers: Record<string, string>;
    paymentRequired: PaymentRequired;
    paymentRequiredHeader: string | null;
  }) {
    super(input);
    this.name = "ComposePaymentRequiredError";
    this.paymentRequired = input.paymentRequired;
    this.paymentRequiredHeader = input.paymentRequiredHeader;
  }
}

function normalizeBaseUrl(baseUrl: string | undefined): string {
  return (baseUrl || "https://api.compose.market").replace(/\/+$/, "");
}

function normalizeWalletAddress(address: string): string {
  const normalized = address.trim().toLowerCase();
  if (!/^0x[a-f0-9]{40}$/u.test(normalized)) {
    throw new Error("wallet address must be a valid 0x-prefixed EVM address");
  }
  return normalized;
}

function resolveChainId(chainId: number | undefined | null): number {
  if (!Number.isInteger(chainId) || Number(chainId) <= 0) {
    throw new Error("chainId must be a positive integer");
  }
  return Number(chainId);
}

function toBudgetWei(input: { budgetUsd?: number; budgetWei?: number | string }): string {
  const hasBudgetUsd = typeof input.budgetUsd === "number";
  const hasBudgetWei = typeof input.budgetWei === "number" || typeof input.budgetWei === "string";

  if (Number(hasBudgetUsd) + Number(hasBudgetWei) !== 1) {
    throw new Error("provide exactly one of budgetUsd or budgetWei");
  }

  if (hasBudgetUsd) {
    const usd = input.budgetUsd!;
    if (!Number.isFinite(usd) || usd <= 0) {
      throw new Error("budgetUsd must be a positive number");
    }
    return String(Math.round(usd * 1_000_000));
  }

  if (typeof input.budgetWei === "number") {
    if (!Number.isInteger(input.budgetWei) || input.budgetWei <= 0) {
      throw new Error("budgetWei must be a positive integer");
    }
    return String(input.budgetWei);
  }

  const trimmed = input.budgetWei!.trim();
  if (!/^\d+$/u.test(trimmed) || BigInt(trimmed) <= 0n) {
    throw new Error("budgetWei must be a positive integer string");
  }
  return trimmed;
}

function resolveExpiresAt(input: { durationHours?: number; expiresAt?: number }): number {
  const hasDurationHours = typeof input.durationHours === "number";
  const hasExpiresAt = typeof input.expiresAt === "number";

  if (Number(hasDurationHours) + Number(hasExpiresAt) !== 1) {
    throw new Error("provide exactly one of durationHours or expiresAt");
  }

  if (hasExpiresAt) {
    if (!Number.isInteger(input.expiresAt) || input.expiresAt! <= Date.now()) {
      throw new Error("expiresAt must be a future unix timestamp in milliseconds");
    }
    return input.expiresAt!;
  }

  const durationHours = input.durationHours!;
  if (!Number.isFinite(durationHours) || durationHours <= 0) {
    throw new Error("durationHours must be a positive number");
  }
  return Date.now() + Math.round(durationHours * 60 * 60 * 1000);
}

function headersToRecord(headers: Headers): Record<string, string> {
  return Object.fromEntries(headers.entries());
}

function tryParseJson(value: string): unknown {
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function parseErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const record = body as Record<string, unknown>;
    if (typeof record.error === "string" && record.error.trim().length > 0) {
      return record.error;
    }
    if (record.error && typeof record.error === "object") {
      const nested = record.error as Record<string, unknown>;
      if (typeof nested.message === "string" && nested.message.trim().length > 0) {
        return nested.message;
      }
    }
    if (typeof record.message === "string" && record.message.trim().length > 0) {
      return record.message;
    }
  }
  return fallback;
}

function decodeBase64Json<T>(value: string): T {
  const normalized = value.replace(/-/gu, "+").replace(/_/gu, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  const base64 = `${normalized}${padding}`;

  if (typeof globalThis.atob !== "function") {
    throw new Error("Base64 decoding is unavailable in this runtime");
  }

  const binary = globalThis.atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const text = new TextDecoder().decode(bytes);
  return JSON.parse(text) as T;
}

function decodePaymentRequiredHeaderValue(value: string): PaymentRequired {
  return decodeBase64Json<PaymentRequired>(value);
}

function stripUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

export class ComposeSDK {
  private readonly baseUrl: string;
  private readonly fetchImpl: FetchLike;
  private walletAddress: string | null;
  private chainId: number | null;
  private composeKey: string | null;

  readonly wallets: {
    attach: (input: { address: string; chainId: number }) => Promise<WalletAttachment>;
    current: () => { address: string | null; chainId: number | null };
    clear: () => void;
  };

  readonly keys: {
    create: (input: {
      purpose: "session" | "api";
      budgetUsd?: number;
      budgetWei?: number | string;
      durationHours?: number;
      expiresAt?: number;
      chainId?: number;
      name?: string;
    }) => Promise<ComposeKeyResponse>;
    getActive: (input?: { chainId?: number }) => Promise<ActiveComposeKeyResponse>;
    list: () => Promise<ComposeKeyListItem[]>;
    revoke: (keyId: string) => Promise<{ success: boolean; keyId: string }>;
    use: (token: string) => void;
    currentToken: () => string | null;
    clearToken: () => void;
  };

  readonly models: {
    list: () => Promise<{ object: "list"; data: Array<Record<string, unknown>> }>;
    listAll: () => Promise<{ object: "list"; data: Array<Record<string, unknown>> }>;
    get: (modelId: string) => Promise<Record<string, unknown>>;
    getParams: (modelId: string) => Promise<ModelParamsResponse>;
  };

  readonly pricing: {
    list: () => Promise<{ models: Array<Record<string, unknown>>; [key: string]: unknown }>;
  };

  readonly inference: {
    responses: {
      create: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      get: (responseId: string, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      inputItems: (responseId: string, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      cancel: (responseId: string, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
    };
    chat: {
      completions: {
        create: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      };
    };
    images: {
      generate: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      edit: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
    };
    audio: {
      speech: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      transcriptions: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
    };
    embeddings: {
      create: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
    };
    videos: {
      generate: (body: Record<string, unknown>, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
      get: (videoId: string, options?: ComposeRequestOptions) => Promise<Record<string, unknown>>;
    };
  };

  readonly x402: {
    facilitator: {
      getSupported: () => Promise<FacilitatorSupportedResponse>;
      verify: (body: Record<string, unknown>) => Promise<Record<string, unknown>>;
      settle: (body: Record<string, unknown>) => Promise<Record<string, unknown>>;
    };
    decodePaymentRequired: (headerValue: string) => PaymentRequired;
  };

  constructor(options: ComposeSDKOptions = {}) {
    this.baseUrl = normalizeBaseUrl(options.baseUrl);
    this.fetchImpl = options.fetch || fetch;
    this.walletAddress = options.walletAddress ? normalizeWalletAddress(options.walletAddress) : null;
    this.chainId = options.chainId !== undefined ? resolveChainId(options.chainId) : null;
    this.composeKey = options.composeKey || null;

    this.wallets = {
      attach: async (input) => this.attachWallet(input),
      current: () => ({
        address: this.walletAddress,
        chainId: this.chainId,
      }),
      clear: () => {
        this.walletAddress = null;
        this.chainId = null;
      },
    };

    this.keys = {
      create: async (input) => this.createKey(input),
      getActive: async (input) => this.getActiveKey(input),
      list: async () => this.listKeys(),
      revoke: async (keyId) => this.revokeKey(keyId),
      use: (token) => {
        this.composeKey = token;
      },
      currentToken: () => this.composeKey,
      clearToken: () => {
        this.composeKey = null;
      },
    };

    this.models = {
      list: async () => this.requestJson("/v1/models", { method: "GET" }),
      listAll: async () => this.requestJson("/v1/models/all", { method: "GET" }),
      get: async (modelId) => this.requestJson(`/v1/models/${encodeURIComponent(modelId)}`, { method: "GET" }),
      getParams: async (modelId) => this.requestJson(`/v1/models/${encodeURIComponent(modelId)}/params`, { method: "GET" }),
    };

    this.pricing = {
      list: async () => this.requestJson("/api/pricing", { method: "GET" }),
    };

    this.inference = {
      responses: {
        create: async (body, options) => this.requestJson("/v1/responses", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
        get: async (responseId, options) => this.requestJson(
          `/v1/responses/${encodeURIComponent(responseId)}`,
          { method: "GET" },
          options,
        ),
        inputItems: async (responseId, options) => this.requestJson(
          `/v1/responses/${encodeURIComponent(responseId)}/input_items`,
          { method: "GET" },
          options,
        ),
        cancel: async (responseId, options) => this.requestJson(
          `/v1/responses/${encodeURIComponent(responseId)}/cancel`,
          { method: "POST" },
          options,
        ),
      },
      chat: {
        completions: {
          create: async (body, options) => this.requestJson("/v1/chat/completions", {
            method: "POST",
            body: JSON.stringify(body),
          }, options),
        },
      },
      images: {
        generate: async (body, options) => this.requestJson("/v1/images/generations", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
        edit: async (body, options) => this.requestJson("/v1/images/edits", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
      },
      audio: {
        speech: async (body, options) => this.requestJson("/v1/audio/speech", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
        transcriptions: async (body, options) => this.requestJson("/v1/audio/transcriptions", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
      },
      embeddings: {
        create: async (body, options) => this.requestJson("/v1/embeddings", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
      },
      videos: {
        generate: async (body, options) => this.requestJson("/v1/videos/generations", {
          method: "POST",
          body: JSON.stringify(body),
        }, options),
        get: async (videoId, options) => this.requestJson(
          `/v1/videos/${encodeURIComponent(videoId)}`,
          { method: "GET" },
          options,
        ),
      },
    };

    this.x402 = {
      facilitator: {
        getSupported: async () => this.requestJson("/api/x402/facilitator/supported", { method: "GET" }),
        verify: async (body) => this.requestJson("/api/x402/facilitator/verify", {
          method: "POST",
          body: JSON.stringify(body),
        }),
        settle: async (body) => this.requestJson("/api/x402/facilitator/settle", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      },
      decodePaymentRequired: decodePaymentRequiredHeaderValue,
    };
  }

  private resolveWalletContext(input?: { walletAddress?: string; chainId?: number }): { address: string; chainId: number } {
    const address = input?.walletAddress ?? this.walletAddress;
    const chainId = input?.chainId ?? this.chainId;

    if (!address) {
      throw new Error("wallet context is required; call wallets.attach(...) first or pass walletAddress");
    }
    if (chainId === null || chainId === undefined) {
      throw new Error("chainId is required; call wallets.attach(...) first or pass chainId");
    }

    return {
      address: normalizeWalletAddress(address),
      chainId: resolveChainId(chainId),
    };
  }

  private resolveComposeKeyToken(input?: { composeKey?: string | null }): string | null {
    if (input && "composeKey" in input) {
      return input.composeKey || null;
    }
    return this.composeKey;
  }

  private async attachWallet(input: { address: string; chainId: number }): Promise<WalletAttachment> {
    const address = normalizeWalletAddress(input.address);
    const chainId = resolveChainId(input.chainId);

    this.walletAddress = address;
    this.chainId = chainId;

    const activeKey = await this.getActiveKey({ chainId });
    return {
      address,
      chainId,
      activeKey,
    };
  }

  private async createKey(input: {
    purpose: "session" | "api";
    budgetUsd?: number;
    budgetWei?: number | string;
    durationHours?: number;
    expiresAt?: number;
    chainId?: number;
    name?: string;
  }): Promise<ComposeKeyResponse> {
    const wallet = this.resolveWalletContext({ chainId: input.chainId });
    return this.requestJson("/api/keys", {
      method: "POST",
      body: JSON.stringify(stripUndefined({
        budgetLimit: toBudgetWei(input),
        expiresAt: resolveExpiresAt(input),
        chainId: wallet.chainId,
        purpose: input.purpose,
        name: input.name,
      })),
    }, {
      walletAddress: wallet.address,
      chainId: wallet.chainId,
    });
  }

  private async getActiveKey(input?: { chainId?: number }): Promise<ActiveComposeKeyResponse> {
    const wallet = this.resolveWalletContext({ chainId: input?.chainId });
    return this.requestJson("/api/session", { method: "GET" }, {
      walletAddress: wallet.address,
      chainId: wallet.chainId,
    });
  }

  private async listKeys(): Promise<ComposeKeyListItem[]> {
    const wallet = this.resolveWalletContext();
    const result = await this.requestJson<{ keys: ComposeKeyListItem[] }>("/api/keys", { method: "GET" }, {
      walletAddress: wallet.address,
      chainId: wallet.chainId,
    });
    return result.keys;
  }

  private async revokeKey(keyId: string): Promise<{ success: boolean; keyId: string }> {
    const wallet = this.resolveWalletContext();
    return this.requestJson(`/api/keys/${encodeURIComponent(keyId)}`, { method: "DELETE" }, {
      walletAddress: wallet.address,
      chainId: wallet.chainId,
    });
  }

  private buildHeaders(options: ComposeRequestOptions = {}, hasBody: boolean): Headers {
    const headers = new Headers(options.headers || {});

    if (hasBody && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    const composeKey = this.resolveComposeKeyToken(options);
    if (composeKey) {
      headers.set("Authorization", `Bearer ${composeKey}`);
    }

    const walletAddress = options.walletAddress ?? this.walletAddress;
    if (walletAddress) {
      headers.set("x-session-user-address", normalizeWalletAddress(walletAddress));
    }

    const chainId = options.chainId ?? this.chainId;
    if (chainId !== null && chainId !== undefined) {
      headers.set("x-chain-id", String(resolveChainId(chainId)));
    }

    if (options.paymentSignature) {
      headers.set("PAYMENT-SIGNATURE", options.paymentSignature);
    }

    if (options.x402MaxAmountWei) {
      headers.set("x-x402-max-amount-wei", options.x402MaxAmountWei);
    }

    return headers;
  }

  private async requestJson<T = Record<string, unknown>>(
    path: string,
    init: RequestInit,
    options: ComposeRequestOptions = {},
  ): Promise<T> {
    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: this.buildHeaders(options, typeof init.body === "string"),
    });

    const text = await response.text();
    const parsedBody = tryParseJson(text);
    if (!response.ok) {
      throw this.buildError(response, parsedBody);
    }

    return parsedBody as T;
  }

  private buildError(response: Response, body: unknown): ComposeApiError {
    const headers = headersToRecord(response.headers);
    const paymentRequiredHeader = response.headers.get("payment-required");
    const paymentRequired = this.extractPaymentRequired(body, paymentRequiredHeader);
    const fallbackMessage = `${response.status} ${response.statusText}`.trim();
    const message = parseErrorMessage(body, fallbackMessage);

    if (response.status === 402 && paymentRequired) {
      return new ComposePaymentRequiredError({
        message,
        status: response.status,
        body,
        headers,
        paymentRequired,
        paymentRequiredHeader,
      });
    }

    return new ComposeApiError({
      message,
      status: response.status,
      body,
      headers,
    });
  }

  private extractPaymentRequired(body: unknown, headerValue: string | null): PaymentRequired | null {
    if (headerValue) {
      try {
        return decodePaymentRequiredHeaderValue(headerValue);
      } catch {
        return null;
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
}

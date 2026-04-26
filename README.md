# `@compose-market/sdk`

Official Compose.Market SDK: Compose Keys, x402 v2 facilitator, 45k+ model catalog, and OpenAI-shaped streaming inference with typed cost receipts.

[![npm](https://img.shields.io/npm/v/@compose-market/sdk.svg)](https://www.npmjs.com/package/@compose-market/sdk)
[![license](https://img.shields.io/npm/l/@compose-market/sdk.svg)](./LICENSE)

The default `ComposeSDK` orchestration client uses platform fetch/Web Streams APIs. The generated OpenAPI subpath clients use Speakeasy's Zod-backed runtime validation.

## Install

```bash
npm install @compose-market/sdk
```

## Quick start

```ts
import { ComposeSDK } from "@compose-market/sdk";

// Whatever identity stack you already use produced a wallet address for
// your user. Pass it through — Compose trusts it exactly the way our
// first-party apps do.
const sdk = new ComposeSDK({
  userAddress: "0x1234567890abcdef1234567890abcdef12345678",
  chainId: 43114, // Avalanche C-Chain
});

// Create a 10 USDC / 24 h Compose Key. The token is returned exactly once;
// store it client-side. Subsequent calls on this SDK instance carry it
// automatically as `Authorization: Bearer compose-<jwt>`.
const session = await sdk.keys.create({
  purpose: "session",
  budgetUsd: "10",
  durationHours: 24,
});

// Non-streaming chat completion with a cost receipt.
const { data, receipt, requestId } = await sdk.inference.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(data.choices[0].message.content);
console.log("Charged", receipt?.finalAmountWei, "wei");
console.log("Request id:", requestId);

// Streaming chat completion — async iterable of ChatCompletionChunk.
const stream = sdk.inference.chat.completions.stream({
  model: "gpt-4.1-mini",
  messages: [{ role: "user", content: "Write a haiku about Avalanche." }],
});
for await (const chunk of stream) {
  process.stdout.write(chunk.choices[0]?.delta?.content ?? "");
}
const { chatCompletion, receipt: streamReceipt } = await stream.final();
console.log("\nTotal tokens:", chatCompletion.usage.total_tokens);
console.log("Settled:", streamReceipt?.finalAmountWei, "wei", streamReceipt?.txHash);
```

## Payment modes

Inference defaults to `paymentMode: "auto"`:

1. If a Compose Key is present, the SDK sends it first for the lowest-latency session path.
2. If no Compose Key is present, or an existing key is rejected and an x402 signer is configured, the SDK requests the raw x402 challenge and retries once with `PAYMENT-SIGNATURE`.
3. `paymentMode: "composeKey"` disables x402 fallback.
4. `paymentMode: "x402"` suppresses Compose Key auth and uses the raw x402 path.

The configured `x402Signer` receives the decoded `PaymentRequired` challenge, request method/path/body, wallet context, chain id, and max amount. It returns either a base64-url `PAYMENT-SIGNATURE` string or a signed x402 `PaymentPayload` object; the SDK encodes objects for the header and retries the request once.

## Capabilities

### Generated OpenAPI Clients

The published package also exports generated clients for direct, contract-first access:

```ts
import { ComposeMarket as X402 } from "@compose-market/sdk/x402";
import { ComposeMarket as Inference } from "@compose-market/sdk/inference";
import { ComposeMarket as Agentic } from "@compose-market/sdk/agentic";
```

- `@compose-market/sdk/x402` exposes generated contracts for x402 settlement, reusable Compose Keys, session state, payments, and facilitator operations.
- `@compose-market/sdk/x402/keys`, `@compose-market/sdk/x402/session`, and `@compose-market/sdk/x402/payments` expose generated payment/session resources directly.
- `@compose-market/sdk/inference` exposes generated contracts for model discovery, inference, and realtime inference streams.
- `@compose-market/sdk/inference/modality` exposes the generated modality catalog resource directly.
- `@compose-market/sdk/agentic` exposes generated contracts for agents, workflows, memory, workspace search, tools, MCP, and mesh execution.
- `@compose-market/sdk/agentic/agent`, `@compose-market/sdk/agentic/workflow`, `@compose-market/sdk/agentic/memory`, and `@compose-market/sdk/agentic/tools` expose generated agentic resources directly.
- `@compose-market/sdk/inference/schemas`, `@compose-market/sdk/inference/operations`, `@compose-market/sdk/agentic/schemas`, and `@compose-market/sdk/agentic/operations` expose generated schema and operation types.

The default `ComposeSDK` remains the higher-level orchestration surface: Compose Key first, raw x402 challenge/sign/retry fallback, typed receipts, streaming aggregation, storage, and event bus.

### Compose Keys

- `sdk.keys.create({ purpose, budgetUsd, durationHours, ... })` — creates a Compose Key JWT. `budgetUsd` must be a decimal string with at most 6 fractional digits; `budgetWei` must be a positive integer string. Requires the underlying wallet to have pre-approved USDC to the Compose treasury for the requested budget.
- `sdk.keys.getActive({ chainId? })` — returns current session metadata (budget, expiry, warnings). **Does not** return the token; the token is returned exactly once by `create()` and must be persisted by the integrator.
- `sdk.keys.list()` — lists all keys for the attached wallet.
- `sdk.keys.get(keyId)` — inspects a single key. Requires possession of that key's JWT.
- `sdk.keys.revoke(keyId)` — revokes a key. Requires possession of that key's JWT.
- `sdk.keys.use(token)` / `sdk.keys.currentToken()` / `sdk.keys.clearToken()` — in-memory token management.

### 45k+ Model Catalog

- `sdk.models.list()` — curated ~612-model set, canonical Compose shape (`{ modelId, name, provider, type, contextWindow, pricing, input, output, ... }`).
- `sdk.models.listAll()` — full ~45k catalog.
- `sdk.models.search({ q, modality, operation, provider, priceMaxPerMTok, contextWindowMin, streaming, cursor, limit })` — cursor-paginated search.
- `sdk.models.get(modelId)` — single model details.
- `sdk.models.getParams(modelId)` — optional per-model parameters for image/video generation.
- `sdk.models.modalities.list()` — canonical modality catalog derived from `models.json` / the registry source of truth.
- `sdk.models.modalities.get(modality)` — one modality with operations and pricing unit metadata.
- `sdk.models.modalities.operations(modality)` — operation catalog for a modality.
- `sdk.models.modalities.models(modality, operation, { q, provider, streaming, cursor, limit })` — operation-specific model selection without provider naming heuristics.

### Inference

Every billable call resolves to `{ data, receipt, requestId, response }`. The receipt is also available as an SSE `event: compose.receipt` frame on streaming calls and as a `X-Compose-Receipt` base64-url header on all billable responses.

- `sdk.inference.chat.completions.create(params)` / `.stream(params)` — OpenAI Chat Completions with typed tool-call delta aggregation and `reasoning_content` deltas.
- `sdk.inference.responses.create(params)` / `.stream(params)` / `.get(id)` / `.inputItems(id)` / `.cancel(id)` — OpenAI Responses API.
- `sdk.inference.embeddings.create(params)`.
- `sdk.inference.images.generate(params)` / `.edit(params)`.
- `sdk.inference.audio.speech(params)` — returns the raw audio `Response`.
- `sdk.inference.audio.transcriptions(params)` — multipart/form-data when `file` is a Blob/File/Uint8Array; JSON+base64 when `file` is a string.
- `sdk.inference.videos.generate(params)` / `.get(id)` / `.stream(id)` / `.waitUntilDone(id, { onStatus })` — async video job polling via SSE.

### x402

- `sdk.x402.facilitator.supported()` — enumerate schemes + CAIP-2 networks the facilitator is configured for.
- `sdk.x402.facilitator.chains()` — full chain metadata (USDC contract, explorer, testnet flag).
- `sdk.x402.facilitator.verify(body)` / `.settle(body)` — direct facilitator access.
- `sdk.x402.decodePaymentRequired(headerValue)` / `.decodePaymentResponse(headerValue)` / `.decodeReceipt(headerValue)` — typed base64-url decoders for the three x402 v2 headers.
- `sdk.x402.encodePaymentSignature(value)` / `encodePaymentSignature(value)` — encode a signed x402 `PaymentPayload` for `PAYMENT-SIGNATURE`.

### Webhooks

- `sdk.webhooks.verify({ body, signature, secret })` — HMAC-SHA256 signature verification (constant-time).
- `sdk.webhooks.constructEvent({ body, signature, secret })` — verify + parse into a typed event. Throws on invalid signatures.

## Error model

Typed error hierarchy — every error derives from `ComposeError` and has a stable `code` matching the canonical server enum.

```ts
import {
  ComposeError,
  ComposeAPIError,
  ComposePaymentRequiredError,
  ComposeBudgetExhaustedError,
  AuthenticationError,
  PermissionDeniedError,
  NotFoundError,
  RateLimitError,
  ComposeConnectionError,
  ComposeTimeoutError,
} from "@compose-market/sdk";

try {
  await sdk.inference.chat.completions.create({ /* ... */ });
} catch (err) {
  if (err instanceof ComposePaymentRequiredError) {
    console.log("x402 payment required:", err.paymentRequired);
  } else if (err instanceof RateLimitError) {
    console.log("Retry after", err.retryAfter, "seconds");
  } else {
    throw err;
  }
}
```

## Streaming events

The SDK surfaces every SSE event the Compose gateway emits:

- Standard OpenAI chunks (`chat.completion.chunk`, `response.output_text.delta`, `response.completed`).
- **Reasoning deltas** — `reasoning_content` in chat chunks, `response.reasoning.delta` in responses streams.
- **Tool-call deltas** — assembled across chunks into a typed `ChatCompletionMessageToolCall[]`.
- **`compose.receipt`** — terminal settlement receipt with tx hash, line items, platform fee.
- **`compose.error`** — structured stream errors when the upstream fails mid-flight.
- **`compose.video.status`** — video job progress updates on `videos.stream(id)`.

## Retries, timeouts, AbortSignal

```ts
const sdk = new ComposeSDK({
  timeoutMs: 30_000,
  retry: {
    maxRetries: 3,
    initialDelayMs: 500,
    maxDelayMs: 8_000,
    jitter: true,
  },
});

const controller = new AbortController();
setTimeout(() => controller.abort(), 5_000);
await sdk.inference.chat.completions.create(
  { model: "gpt-4.1-mini", messages: [{ role: "user", content: "..." }] },
  { signal: controller.signal },
);
```

The SDK auto-retries 408 / 409 / 425 / 429 / 5xx responses and transient network errors, honors `Retry-After` from 429 responses, and forwards caller-provided `X-Idempotency-Key` values on mutating calls.

## Supported chains (v1.0)

- **Avalanche C-Chain** (`eip155:43114`)
- **Avalanche Fuji testnet** (`eip155:43113`)

Solana support ships in v1.1. Enumerate live chains with `sdk.x402.facilitator.chains()`.

## What this SDK is NOT

- Not a wallet. The SDK never prompts for a signature, never creates a smart account, never runs KYC. Identity is whatever you already have.
- Not a retry-forever loop on payment-required errors. With an x402 signer, the SDK performs one challenge/sign/retry cycle; otherwise 402 responses are surfaced as typed errors.
- Not a Thirdweb/Privy/Clerk/Auth0 adapter. It's transport-agnostic on purpose — integrators bring whatever identity stack they already use.

Not bundled:
- No wallet client, no identity provider, no auth SDK. Bring the wallet address your stack produced and keep the rest of your infrastructure unchanged.

## Contract generation

The canonical OpenAPI contracts live in `specs/x402.openapi.yaml`, `specs/inference.openapi.yaml`, and `specs/agentic.openapi.yaml`. Speakeasy configuration lives in `.speakeasy/`, including the Arazzo workflow tests for model selection, Compose Key sessions, Compose Key inference, raw x402 challenge/retry, streaming frames, and agentic agent/workflow loops.

Generated clients live under `generated/x402`, `generated/inference`, and `generated/agentic`. The root build compiles the hand-written orchestration client and all generated clients before publish.

Speakeasy generation keeps `text/event-stream` in the contracts and uses envelope responses so payment, receipt, and request headers remain part of the typed generated surface. The ergonomic streaming aggregation helpers live on the default `ComposeSDK` orchestration client.

## Local Version Sync

`package.json` is the only version source of truth. `npm run build`, `npm test`, and `npm run typecheck` run `scripts/sync-version.mjs`, which updates:

- Root `package-lock.json`.
- `specs/*.openapi.yaml` `info.version`.
- `.speakeasy/tests.arazzo.yaml` `info.version`.
- `.speakeasy/gen.yaml` TypeScript generation version.
- Generated package metadata under `generated/x402`, `generated/inference`, and `generated/agentic`.
- `src/version.ts`.

## License

MIT

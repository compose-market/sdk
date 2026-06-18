# `@compose-market/sdk`

Official Compose.Market SDK: Compose Keys, x402 v2 facilitator, multi-provider model catalog, OpenAI-shaped streaming inference with typed cost receipts, and feedback/reputation for endpoints, payment flows, models, agents, and workflows.

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
import { ComposeMarket as Agentic } from "@compose-market/sdk/manowar";
```

- `@compose-market/sdk/x402` exposes generated contracts for x402 settlement, reusable Compose Keys, session state, payments, and facilitator operations.
- `@compose-market/sdk/x402/keys`, `@compose-market/sdk/x402/session`, `@compose-market/sdk/x402/payments`, and `@compose-market/sdk/x402/feedback` expose generated payment/session/feedback resources directly.
- `@compose-market/sdk/inference` exposes generated contracts for model discovery, inference, and realtime inference streams.
- `@compose-market/sdk/inference/modality` exposes the generated modality catalog resource directly.
- `@compose-market/sdk/manowar` exposes generated contracts for agents, workflows, memory, workspace search, connectors, MCP, onchain, and mesh execution.
- `@compose-market/sdk/manowar/agent`, `@compose-market/sdk/manowar/workflow`, `@compose-market/sdk/manowar/connectors`, `@compose-market/sdk/manowar/workspace`, and `@compose-market/sdk/manowar/mesh` expose generated manowar resources directly.
- `@compose-market/sdk/memory` and `@compose-market/sdk/memory/framework` expose the generated memory contracts directly.
- `@compose-market/sdk/inference/schemas`, `@compose-market/sdk/inference/operations`, `@compose-market/sdk/manowar/schemas`, and `@compose-market/sdk/manowar/operations` expose generated schema and operation types.

The default `ComposeSDK` remains the higher-level orchestration surface: Compose Key first, raw x402 challenge/sign/retry fallback, typed receipts, streaming aggregation, storage, feedback, and event bus.

### Compose Keys

- `sdk.keys.create({ purpose, budgetUsd, durationHours, ... })` — creates a Compose Key JWT. `budgetUsd` must be a decimal string with at most 6 fractional digits; `budgetWei` must be a positive integer string. Requires the underlying wallet to have pre-approved USDC to the Compose treasury for the requested budget.
- `sdk.keys.getActive({ chainId? })` — returns current session metadata (budget, expiry, warnings). **Does not** return the token; the token is returned exactly once by `create()` and must be persisted by the integrator.
- `sdk.keys.list()` — lists all keys for the attached wallet.
- `sdk.keys.get(keyId)` — inspects a single key. Requires possession of that key's JWT.
- `sdk.keys.revoke(keyId)` — revokes a key. Requires possession of that key's JWT.
- `sdk.keys.use(token)` / `sdk.keys.currentToken()` / `sdk.keys.clearToken()` — in-memory token management.

### Model Catalog

- `sdk.models.list()` — curated, fast-loading model set, canonical Compose shape (`{ modelId, upstreamModelId?, name, provider, type, contextWindow, pricing, input, output, ... }`).
- `sdk.models.listAll()` — full compiled catalog.
- `sdk.models.search({ q, modality, operation, provider, priceMaxPerMTok, contextWindowMin, streaming, cursor, limit })` — cursor-paginated search.
- `sdk.models.get(modelId)` — single model details.
- `sdk.models.getParams(modelId)` — optional per-model parameters for image/video generation.
- `sdk.models.pricing()` — priced model table from `/api/pricing` for calculators and quote previews.
- `sdk.models.modalities.list()` — canonical modality catalog derived from `models.json` / the registry source of truth.
- `sdk.models.modalities.get(modality)` — one modality with operations and pricing unit metadata.
- `sdk.models.modalities.operations(modality)` — operation catalog for a modality.
- `sdk.models.modalities.models(modality, operation, { q, provider, streaming, cursor, limit })` — operation-specific model selection without provider naming heuristics.

### Inference

Every billable call resolves to `{ data, receipt, requestId, response }`. The receipt is also available as an SSE `event: receipt` frame on streaming calls and as a `X-Receipt` base64-url header on all billable responses.

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
- `sdk.x402.payments.prepare({ service, action, resource, method, maxAmountWei | meter, ... })` — authorize a reusable Compose Key payment intent.
- `sdk.x402.payments.settle({ paymentIntentId, finalAmountWei | meter })` — settle a prepared intent with the final server-side amount.
- `sdk.x402.payments.abort({ paymentIntentId, reason })` — release a prepared intent that will not be settled.
- `sdk.x402.payments.meterModel({ modelId, provider?, modality, usage?, media? })` — ask the API to produce the authoritative model-meter quote from catalog pricing and telemetry evidence.
- `sdk.x402.decodePaymentRequired(headerValue)` / `.decodePaymentResponse(headerValue)` / `.decodeReceipt(headerValue)` — typed base64-url decoders for the three x402 v2 headers.
- `sdk.x402.encodePaymentSignature(value)` / `encodePaymentSignature(value)` — encode a signed x402 `PaymentPayload` for `PAYMENT-SIGNATURE`.

### Feedback

Feedback is a side channel. It records reports against stable IDs without blocking inference, settlement, or runtime streams.

- `sdk.feedback.submit({ target, rating, message, category, context })` — submit feedback for `endpoint`, `x402`, `model`, `agent`, or `workflow`.
- `sdk.feedback.model(modelId, input)`, `.agent(agentWallet, input)`, `.workflow(workflowWallet, input)`, `.x402(targetId, input)`, `.endpoint(targetId, input)` — target-specific helpers.
- `sdk.feedback.summary({ type, id })` — reputation summary with rating distribution and verification counts.
- `sdk.feedback.list({ type, id })` — recent public feedback records.

When a Compose Key is present, feedback is submitted as `compose_key` verified. Without a key, the SDK forwards attached wallet headers when available; otherwise feedback is anonymous. Feedback context can carry `requestId`, `paymentIntentId`, `composeRunId`, `modelId`, `provider`, receipt tx hash, and SDK version. Prompts and responses are never required.

### Public Directory

- `sdk.directory.agents.list()` — public Compose agents.
- `sdk.directory.agents.search(query, { limit? })` — public agent search.
- `sdk.directory.agents.get(walletAddress)` — one public agent card.
- `sdk.directory.agents.agentverse({ search?, category?, tags?, limit?, offset?, sort?, direction? })` — Fetch.ai Agentverse bridge exposed by the API gateway.
- `sdk.directory.workflows.list()` — public Compose workflows.
- `sdk.directory.workflows.get(walletAddress)` — one public workflow card.

### System

- `sdk.system.health()` — API health response from `/health`.
- `sdk.system.frameworks()` — runtime framework catalog from `/frameworks`.

### Local Control Plane

- `sdk.local.link.create({ userAddress?, chainId?, agentWallet?, agentCardCid?, deviceId? })` — create a Manowar local-link token for web-to-local handoff.
- `sdk.local.link.redeem({ token, deviceId, connectedUserAddress? })` — redeem a local-link token and receive the API-provided local context.
- `sdk.local.deployments.register({ agentWallet, composeKeyId, agentCardCid, localVersion, deployedAt, ... })` — register a local deployment against the active Compose Key.
- `sdk.local.network.upsert({ peers, ... })` / `.peers({ ... })` — update and read local peer summaries.
- `sdk.local.synapse.session({ agentWallet, deviceId, sessionKeyAddress, sessionKeyExpiresAt, depositAmount? })` — provision a Synapse session-key control-plane session.
- `sdk.local.filecoin.session({ agentWallet, deviceId, sessionKeyAddress, sessionKeyExpiresAt, fileSizeBytes, copies? })` — provision Filecoin Pin storage context for local learning data.

### Permissions, Accounts, And Channels

- `sdk.permissions.list({ agentWallet })` / `.grant({ agentWallet, consentType, ... })` / `.revoke({ agentWallet, consentType })` — browser permission grants scoped per user and agent.
- `sdk.accounts.connect({ agentWallet, toolkit })`, `.list({ agentWallet })`, `.status({ agentWallet, toolkit, connectedAccountId })`, `.disconnect({ agentWallet, toolkit, connectedAccountId })` — explicit Composio connected-account lifecycle.
- `sdk.accounts.execute({ agentWallet, toolkit, connectedAccountId, action, params?, text? })` — execute a connected toolkit action through the API with an explicit connected account.
- `sdk.accounts.toolkits.list({ search?, limit? })` / `.actions(toolkit, { limit? })` — discover available Composio toolkits and actions.
- `sdk.channels.link(channel, { agentWallet, agentName?, mode?, privacy? })`, `.status(channel, { agentWallet })`, `.disconnect(channel, { agentWallet })` — create and manage native Telegram, WhatsApp, Slack, and Discord channel bindings through the channels service.
- Configure `channelsUrl` when using a non-production channels service. `baseUrl` remains the API URL for permissions and accounts; `channelsUrl` defaults to `https://services.compose.market`.
- Discord supports `mode: "user" | "guild"` and optional guild `privacy: "public" | "private"`. Slack supports DM and workspace/thread bindings through the Slack app. Session renewal links sent by channels are global web-app links, not agent- or channel-scoped payment links.

### Dispenser And Settlement

- `sdk.dispenser.claim({ address?, chainId? })` — claim starter USDC through the API dispenser route.
- `sdk.dispenser.status()` / `.status(chainId)` / `.check({ address? })` — inspect dispenser availability and claim status.
- `sdk.settlement.status({ userAddress?, chainId? })` — read the active session settlement/budget status for a wallet.

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
- **`receipt`** — terminal settlement receipt with tx hash, line items, platform fee.
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
- Not an OpenAI compatibility shim. The SDK targets Compose's native `/v1/*`, x402, feedback, memory, and runtime contracts; `/external/*` compatibility routes are intentionally not part of this package.

Not bundled:
- No wallet client, no identity provider, no auth SDK. Bring the wallet address your stack produced and keep the rest of your infrastructure unchanged.

## Contract generation

The canonical OpenAPI contracts live in `specs/x402.openapi.yaml`, `specs/inference.openapi.yaml`, and `specs/manowar.openapi.yaml`. Speakeasy configuration lives in `.speakeasy/`, including the Arazzo workflow tests for model selection, Compose Key sessions, Compose Key inference, raw x402 challenge/retry, streaming frames, and manowar agent/workflow loops.

Generated clients live under `generated/x402`, `generated/inference`, and `generated/manowar`. The root build compiles the hand-written orchestration client and all generated clients before publish.

Speakeasy generation keeps `text/event-stream` in the contracts and uses envelope responses so payment, receipt, and request headers remain part of the typed generated surface. The ergonomic streaming aggregation helpers live on the default `ComposeSDK` orchestration client.

## Local Version Sync

`package.json` is the only version source of truth. `npm run build`, `npm test`, and `npm run typecheck` run `scripts/sync-version.mjs`, which updates:

- Root `package-lock.json`.
- `specs/*.openapi.yaml` `info.version`.
- `.speakeasy/tests.arazzo.yaml` `info.version`.
- `.speakeasy/gen.yaml` TypeScript generation version.
- Generated package metadata under `generated/x402`, `generated/inference`, and `generated/manowar`.
- `src/version.ts`.

## License

MIT

# Changelog

## 0.4.0

Runtime streams + unified tool-call broadcasting. Enables web/ to consume agent + workflow SSE through typed resources instead of hand-rolled `parseEventStream` loops.

### Highlights

- **`sdk.agent.stream({ agentWallet, message, threadId, userAddress, ... })`** — typed iterator over the Compose agent runtime SSE vocabulary (`text-delta`, `thinking-start`, `thinking-end`, `tool-start`, `tool-end`, `error`, `done`). `final()` returns `{ text, toolCalls, requestId, receipt, budget, sessionInvalidReason }`.
- **`sdk.workflow.stream({ workflowWallet, message, threadId, userAddress, ... })`** and **`sdk.workflow.stop(...)`** — typed iterator over the workflow runtime vocabulary (`start`, `step`, `agent`, `progress`, `tool-start`, `tool-end`, `result`, `complete`, `error`, `done`). `final()` returns `{ text, structuredOutput, toolCalls, requestId, receipt, budget, sessionInvalidReason }`.
- **Unified tool-call events** — `sdk.events.on("toolCallStart", ...)` and `on("toolCallEnd", ...)` fire for chat-completions, responses, agent, and workflow streams alike. Each event carries `source: "chat" | "responses" | "agent" | "workflow"` so UI strips can react uniformly.
- **Responses API tool-call aggregation** — `ResponsesStreamFinalResult.toolCalls` now carries an assembled `[{ id, name, arguments }]` array reconstructed from `response.tool_call` and `response.tool_call.delta` frames.
- **Lifecycle events** — `sdk.events.agentStreamStart` / `agentStreamEnd` / `workflowStreamStart` / `workflowStreamEnd` fire around each runtime stream.
- **`baseUrl` constructor option** — defaults to `api.<host>/agent/${wallet}`; set explicitly for staging/custom runtimes.

### Breaking changes

- `ResponsesStreamFinalResult` now includes a `toolCalls` field.
- `ComposeEventMap` has new entries (`toolCallStart`, `toolCallEnd`, `agentStreamStart`, `agentStreamEnd`, `workflowStreamStart`, `workflowStreamEnd`). Consumers relying on the union of event names will widen automatically.

### Tests

- `tests/sdk.runtime-streams.test.ts` — 5 contract tests covering agent stream, workflow stream, agent lifecycle events, Responses tool-call aggregation, and `baseUrl` defaulting. All hermetic (in-test `node:http` servers).

---

## 0.3.0

Live session state surfaces all the way to the caller. First-party parity milestone.

### Highlights

- **`sdk.events` typed event bus.** Listeners for `budget`, `sessionInvalid`, `sessionActive`, `sessionExpired`, `receipt`. Dispatched automatically on every billable response and every SSE session-event frame. Returns disposers; `.once(...)` fires exactly once.
- **Live session budget on every response.** `ComposeCompletion<T>` grows `budget` and `sessionInvalidReason` fields sourced from the `x-session-budget-*` / `x-compose-session-invalid` response headers. No more side-channel fetches to `/api/session` to render a session indicator.
- **SSE session events resource.** `sdk.session.subscribe({ signal })` streams `session-active` / `session-expired` frames from `/api/session/events`. Auto-reconnects with jittered backoff. Wallet context defaults to `sdk.wallets.current()`.
- **Persistent token storage.** New `storage` + `tokenScope` constructor options. Browsers auto-use `localStorage`; Node callers pass an explicit adapter. Tokens are keyed by `(address, chainId)` so multi-wallet devices never collide. A fresh `ComposeSDK` instance with the same wallet re-hydrates the token without a network call.
- **`keys.get` / `keys.revoke` now attach `x-session-user-address` + `x-chain-id`.** Matches the canonical header contract the rest of the SDK uses.
- **Single source of truth for version.** `sdk.version` reads from `package.json` via a build-time generated `src/version.ts`. No more duplicated constants anywhere.
- **`userAddress` is the canonical field name** across the SDK (was `walletAddress` in internal types); aligns with the header `x-session-user-address` and the Compose Market backend.

### New tests

- `sdk.events.test.ts` — budget / receipt / sessionInvalid emission, disposer, once semantics, storage persistence, version agreement.
- `sdk.session-events.test.ts` — SSE iterator + event-bus bridge for `session-active` / `session-expired`, wallet-context guards.

### Breaking changes from 0.2.0

- `HeaderBagInput.walletAddress` renamed to `HeaderBagInput.userAddress`.
- `ComposeCallOptions.walletAddress` renamed to `ComposeCallOptions.userAddress`.
- `ComposeCompletion<T>` now includes `budget` and `sessionInvalidReason`. Existing consumers that destructured `{ data, receipt, requestId, response }` are unaffected; consumers that did `const completion: ComposeCompletion<T> = ...` and then structural-assigned may need to accept the new fields.
- `audio.speech(...)` return type grows `budget` + `sessionInvalidReason` alongside the existing `{ response, receipt, requestId }`.
- Streaming final results (`ChatCompletionFinalResult`, `ResponsesStreamFinalResult`) grow `budget` + `sessionInvalidReason`.
- The `SDK_VERSION` constant is no longer exported at a stable location; use `sdk.version` on an instance.

---

## 0.2.0

First production-shaped release. Full rewrite from the 0.1.x typed-fetch prototype.

### Highlights

- **Modular architecture** — dedicated resource classes (`KeysResource`, `ModelsResource`, `InferenceResource`, `X402Resource`, `WebhooksResource`) over a shared `HttpClient` with lazy request execution (no double-fire when a caller does both `await` and `.asResponse()`).
- **Streaming** — `AsyncIterable<ChatCompletionChunk>` and `AsyncIterable<ResponseStreamEvent>` with `.final()` for reassembled chat completions, tool-call deltas, and reasoning deltas.
- **Typed cost receipts** — every billable call returns `{ data, receipt, requestId, response }`; streams emit a terminal `event: compose.receipt` frame; non-streaming calls carry `X-Compose-Receipt` header + `compose_receipt` JSON field.
- **Canonical Compose model card** — `sdk.models.list()` returns the flat Compose-native shape `{ modelId, name, provider, type, contextWindow, pricing, ... }` exactly as served by `api.compose.market`. `sdk.models.search()` adds cursor pagination with modality/provider/price/context filters over the full ~45k catalog.
- **x402 v2 first-class** — facilitator `supported`/`chains`/`verify`/`settle` + typed decoders for `PAYMENT-REQUIRED`, `PAYMENT-RESPONSE`, `X-Compose-Receipt`. New `sdk.x402.facilitator.chains()` enumerates live chains + USDC contract metadata.
- **Typed error tree** — `ComposeError` → `ComposeAPIError` → `BadRequestError` / `AuthenticationError` / `PermissionDeniedError` / `NotFoundError` / `ConflictError` / `UnprocessableEntityError` / `RateLimitError` / `InternalServerError` / `ComposePaymentRequiredError` / `ComposeBudgetExhaustedError`. Every error carries `code`, `status`, `details`, `requestId`, and (for 402) `paymentRequired`.
- **Webhook verification** — HMAC-SHA256, Stripe-style `X-Compose-Signature: t=...,v1=...` header, constant-time comparison.
- **Retries + timeouts + AbortSignal** — jittered exponential backoff; honors `Retry-After`; auto-generates `X-Idempotency-Key` on mutations.
- **Video job streaming** — `sdk.inference.videos.stream(id)` / `.waitUntilDone(id, { onStatus })` for SSE-driven polling.

### Tests

- **Hermetic.** Three suites: `sdk.unit.test.ts` (pure), `sdk.streaming.test.ts` (in-test synthetic SSE server), `sdk.contract.test.ts` (in-test mock HTTP server with canned responses mirroring `api.compose.market`).
- No sibling-repo imports. No Redis. No Thirdweb. No secrets. No environment variables. Runs clean from a fresh `git clone`.

### Infrastructure prerequisites

This release aligns with Compose api/ Phase 0 changes:
- `GET /api/session` no longer returns the Compose Key token (metadata only).
- `DELETE /api/keys/:keyId` requires JWT-possession auth.
- `GET /api/keys/:keyId` added for single-key inspection.
- `GET /api/x402/facilitator/chains` added for chain metadata enumeration.
- `X-Request-Id` is set on every response; `X-Compose-Receipt` on billable responses.
- SSE streams emit named `compose.receipt`, `compose.error`, `compose.video.status` events.
- CORS is unified (allow-list + `Vary: Origin` + explicit `Expose-Headers`).
- `POST /api/payments/prepare` honors `X-Idempotency-Key` — replays return the original intent unchanged.

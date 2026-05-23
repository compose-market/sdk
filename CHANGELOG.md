# Changelog

## 0.6.96 — Native SDK parity guards and third-party web integration cleanup

### Highlights

- Kept `sdk.inference` as explicit endpoint wrappers only: chat completions, responses, embeddings, images, audio speech/transcriptions, and videos.
- Added contract guards that prevent reintroducing `/external/*`, metrics, internal avatar/banner services, or fake `sdk.inference.plan/run` dispatcher methods.
- Preserved the existing published runtime/memory/manowar surface without expanding it in this pass.
- Updated first-party `web/` integration to use SDK catalog operation data and explicit SDK endpoint calls instead of the removed planner/runner path.
- Replaced raw Backpack and workflow stop calls in `web/` with existing typed SDK resources.

### Tests

- `npx tsc --noEmit -p tsconfig.json --pretty false`
- `node --import tsx --test tests/sdk.unit.test.ts tests/sdk.streaming.test.ts tests/sdk.contract.test.ts tests/sdk.session-events.test.ts tests/sdk.events.test.ts tests/sdk.runtime-streams.test.ts` — 83 passing tests.
- Web third-party integrator checks pass after consuming the SDK from `web/`.

## 0.6.94 — Native SDK parity for x402 metering, local control, and directory APIs

### Highlights

- Added `sdk.x402.payments.prepare(...)`, `.settle(...)`, `.abort(...)`, and `.meterModel(...)` as thin typed wrappers over the API payment intent and authoritative model-metering routes.
- Added model-metering public types: `MeteredInput`, `MeterLineItem`, `MeteredQuote`, `ModelMeterQuote`, and payment intent request/response shapes.
- Added `sdk.models.pricing()` for the API pricing table used by quote previews and cost calculators.
- Added `sdk.directory.agents.*` and `sdk.directory.workflows.*` for public Compose agent/workflow discovery plus the Agentverse bridge.
- Added `sdk.system.health()` and `.frameworks()` for API health/runtime framework discovery.
- Added `sdk.local.*` for local-link tokens, local deployment registration, peer summaries, Synapse session-key provisioning, and Filecoin Pin storage preparation.
- Added `sdk.backpack.*` for permission storage, Composio connection lifecycle, toolkit/action discovery, action execution, and Telegram binding helpers.
- Added `sdk.dispenser.*` and `sdk.settlement.status(...)` for stable public dispenser and wallet settlement-status routes.
- Fixed fragile multiline OpenAPI descriptions in the inference and x402 specs so YAML parsing and Speakeasy linting are clean.

### Tests

- Added hermetic contract coverage for x402 payment intent prepare/settle/abort, model metering, pricing, public directory routes, Agentverse query forwarding, system routes, local routes, Backpack, dispenser, settlement status, and package exclusion guards.
- Verified OpenAPI specs parse locally and Speakeasy lint reports 0 errors / 0 warnings for inference, x402, memory, and manowar.
- `npm run typecheck`
- `npm test` — 82 passing tests.

## 0.6.92 — Provable mal plans + fire-and-forget Daytona Sandboxes

### Highlights

- **`MalPlan.requireProof: boolean`** — when set, the harness accumulates a typed proof bundle through plan execution (every step's input/output hashes, dedup'd inference run ids, sandbox metadata when isolation is active) and pins it to IPFS via Pinata at plan termination. The CIDv1 + gateway URL come back on `MalRunResult.proofCid` / `proofUrl` for receipt embedding. Schema: `compose.proof.v1`. Verifiers fetch the bundle from any IPFS gateway and cross-check `inferenceRunIds` against x402 receipts.
- **`MalPlan.requireIsolation: boolean`** — round-tripped through `parseMalPlan` and ships the field on `MalPlan`.
- **New SDK exports** from `@compose-market/sdk` (re-exported from `harness`):
  - `createProofAccumulator`, `pinProofBundleToIPFS`, `signProofBundle`, `canonicalJson`, `hashValue`
  - Types: `ProofBundle`, `ProofStepRecord`, `ProofSandboxMetadata`, `ProofAccumulator`

### Backwards compatibility

- Both new flags default to `false`;
- `MalRunResult.proofCid` and `MalRunResult.proofUrl` are optional; existing consumers that ignore them are unaffected.

## 0.6.91 — Agentic loop hardening

### Highlights

- **`memory_recall` tool removed.** The `memory.arazzo.yaml` contract states "ranker picks for you" — pre-injection (~900 chars / 6 items per turn) is sufficient. The tool let the model second-guess the ranker mid-turn, doubling work and contradicting the contract. `memory_remember` stays (orthogonal use case: explicit user-stated facts the auto-extractor missed).
- **Memory `type: "other"` removed.** The 6 typed categories (`preference / identity / context / skill / relationship / event`) cover everything stable. The SDK union type narrowed accordingly; `memory.save({ type: "context" })` is the new default for unknown types.
- **`stored.graph` is now always `false` on `record_turn`.** Fact extraction is fire-and-forget; facts surface in the next pre_turn recall. p50 is now <50ms (was up to 8s when Gemini extraction blocked).
- **Voyage `input_type` semantics honored.** Query embeddings now use `input_type: "query"`; document indexing keeps `"document"`. Real recall improvement (Voyage's asymmetric encoding).
- **Gemini `response_format` now plumbed end-to-end.** `{ type: "json_object" | "json_schema" }` translates to AI-SDK's `Output.json()`/`Output.object()`, which @ai-sdk/google maps to `responseMimeType` + `responseSchema`. Affects every chat-completions / responses caller.
- **`/api/agentverse/agents` route wired** (was advertised in startup banner but never registered).
- **Inner-loop budget gate replaces 6-batch hard cap.** Three axes: wall time (default 4 min), consecutive tool failures (default 4), Manus-grade safety ceiling (default 50 batches). Tunable via `COMPOSE_AGENT_MAX_WALL_MS_PER_TURN`, `COMPOSE_AGENT_MAX_TOOL_FAILURES_IN_ROW`, `COMPOSE_AGENT_MAX_TOOL_BATCHES_PER_TURN`.
- **Stable tool binding** (Manus / KV-cache discipline). Bound tools no longer re-scored per turn — KV cache stays warm across iterations.
- **Tightened discipline footer.** Six-rule directive list aware of memory/a2a/loop contracts. ~140 tokens.

### Breaking changes

- `MemoryToolType` no longer includes `"other"`. Migration: replace with `"context"`.
- `memory_recall` tool removed from agent tool surface. Migration: rely on the automatic ranker pre-injection (no caller change needed).

### Internal

- Tool-call extraction consolidated to a single source of truth in `runtime/src/manowar/agent/tool-calls.ts`. The 3 prior implementations (graph.ts, framework.ts, harness/engine.ts) now share `readToolMallsFromRecord` + `readToolCallChunksFromRecord`. ~150 LOC of duplicate logic eliminated.
- `workflow/agentic.ts` deleted (deprecated hardcoded coordinator list — `harness/coordinators.ts` is the dynamic source of truth).

## 0.6.8

### Highlights

- **First-party 6-layer memory framework.** Mem0 cloud removed entirely. Graph-layer durable facts now live in the same Mongo `memory` collection as conversational vectors (with `source: "fact"`, `metadata.layer: "graph"`), extracted by `gemini-3.1-flash-lite-preview` via our own inference gateway. Voyage `voyage-4-large` (1024-d) is the sole embedder; Cloudflare `bge-reranker-base` is the cross-encoder. Recall p50 dropped from ~905ms (mem0 round-trip) to <120ms.
- **Cross-thread durable recall now actually works.** The vectors layer was thread-scoped by mistake — fixed; `(agentWallet, userAddress)` is the durability boundary, threadId narrows working+scene only.
- **Agent memory tools simplified.** `save_memory` + `search_memory` + `search_all_memory` collapsed into `memory_recall` and `memory_remember`. The cross-layer ranker handles which layers contribute; agents do NOT pick layers.
- **Post-turn persistence is fire-and-forget.** Fact extraction never blocks the agent response.
- **SDK ergonomic shortcuts:**
  - `sdk.memory.recall(query, { agentWallet, userAddress })` — string-first pre-turn block
  - `sdk.memory.save(content, { agentWallet, userAddress, type? })` — string-first durable fact
- **`MemoryShorthandOptions`** type added for the helpers above.
- **`AgentMemoryRecordTurnResponse.stored`** now exposes `graph` alongside `transcript`/`working`/`vector` so callers can assert all four bookend layers landed.
- **Memory Arazzo workflow rewritten** as a 10/10 onboarding doc — covers the canonical `agent_turn_loop`, `maintenance_loop`, `pattern_promotion_loop`, and `eval_loop`. No mem0 references; explicit scope rules; explicit cost / latency budget; per-step descriptions explain when and why.

### Bug fixes

- The vectors layer filter no longer includes `threadId` — durable cross-thread recall now works.
- API gateway no longer aborts the prepared x402 payment when the SSE `[DONE]` terminator passes through `parseSseEventBlock`.
- `stopped` and `error` SSE events now carry usage payload so the gateway settles partial work on user-initiated abort.

## 0.6.7

### Highlights

- Agent runtime: rich streaming events. New `tool-args-delta` (per-token tool argument streaming, mirrors Codex `response.function_call_arguments.delta` / Claude Code `input_json_delta`) and `stopped` (user-initiated abort).
- Agent runtime: `sdk.agent.stop({ agentWallet, runId, threadId? })` aborts an in-flight stream while preserving the LangGraph checkpoint — a subsequent stream call with the same `threadId` resumes the thread's conversation, CoT, and memory.
- Identity binding restored. Agents always know their on-chain identity (name, description, wallet, skills) via per-turn typed `AgentIdentity` block hydrated once from Pinata IPFS — no more "I'm a helpful assistant" drift.
- Multi-step tool loop fixed. Removed the kill-switch that unbound tools after one successful batch; the model now decides exit by emitting no tool_calls (LangGraph Deep Agents / Manus / Codex / Claude Code SOTA pattern).
- Memory tools restored: `save_memory`, `search_memory`, `search_all_memory` re-bound, all routed through the unified `runAgentMemoryLoop` (six-layer memory: working / scene / graph / patterns / archives / vectors).

## Unreleased

### Highlights

- Added the root `sdk.feedback` resource for endpoint, x402, model, agent, and workflow feedback.
- Added `POST /v1/feedback`, `GET /v1/feedback`, and `GET /v1/feedback/summary` to the x402 OpenAPI contract.
- Feedback automatically carries Compose Key auth or wallet headers when available and returns verification counts separately from anonymous feedback.

### Tests

- Added SDK contract coverage for `sdk.feedback.model(...)` and `sdk.feedback.summary(...)`.

---

## 0.5.0

Root-cause SDK generation, modality catalog, and local build version-sync pass.

### Highlights

- Added the generated modality surface to the inference contract and package exports:
  - `@compose-market/sdk/inference/modality` for the generated Speakeasy resource.
  - `sdk.models.modalities.list()`, `.get(modality)`, `.operations(modality)`, and `.models(modality, operation, filters)` on the orchestration client.
- Added modality-aware model selection to `sdk.models.search({ operation, ... })` and the Arazzo model discovery workflow.
- Kept realtime inference SSE in the OpenAPI contract while using Speakeasy envelope responses so receipt/payment/request headers remain typed.
- Expanded `.speakeasy/tests.arazzo.yaml` for modality discovery and realtime stream coverage, including video SSE.
- Fixed `scripts/sync-version.mjs` so `package.json` is the single source of truth for root lockfile, OpenAPI specs, Arazzo, Speakeasy generation config, generated package metadata, generated JSR metadata, generated Speakeasy locks, and `src/version.ts`.
- Added the generated `@compose-market/sdk/inference/modality` subpath export and verified the published package surface resolves from Node.

### Tests

- `npm test` - 52 passing tests.
- `npm run typecheck`
- `npm run build`
- `node --input-type=module -e '...'` import check for `@compose-market/sdk`, `/x402`, `/inference`, `/inference/modality`, and `/manowar`.
- `npm pack --dry-run --cache /tmp/compose-npm-cache`

---

## 0.4.3

OpenAPI/Arazzo contract freeze plus production payment-safety pass.

### Highlights

- Added canonical Speakeasy-ready contracts:
  - `/Users/jabyl/Downloads/compose-market/packages/sdk/specs/x402.openapi.yaml` for x402 settlement, Compose Keys, sessions, payments, and facilitator operations.
  - `/Users/jabyl/Downloads/compose-market/packages/sdk/specs/inference.openapi.yaml` for model discovery, inference, and realtime inference streams.
  - `/Users/jabyl/Downloads/compose-market/packages/sdk/specs/manowar.openapi.yaml` for agents, workflows, memory, workspace search, tools, MCP, and mesh execution.
  - `/Users/jabyl/Downloads/compose-market/packages/sdk/.speakeasy/tests.arazzo.yaml` for model discovery, Compose Key session lifecycle, Compose Key inference, raw x402 challenge/retry, streaming inference frames, and runtime agent/workflow loops.
- Added `.speakeasy/workflow.yaml` and `.speakeasy/gen.yaml` so the SDK repo is ready for Speakeasy generation once the CLI is authenticated.
- Generated and exported Speakeasy TypeScript clients:
  - `@compose-market/sdk/x402`, `/x402/keys`, `/x402/session`, and `/x402/payments` for x402 settlement, Compose Keys, session state, payments, and facilitator operations.
  - `@compose-market/sdk/inference` for model discovery, inference, and realtime streams.
  - `@compose-market/sdk/manowar` plus `/manowar/agent`, `/manowar/workflow`, `/manowar/memory`, and `/manowar/tools`.
  - Generated schema and operation types under `/inference/schemas`, `/inference/operations`, `/manowar/schemas`, and `/manowar/operations`.
- Root `npm run build` now compiles the hand-written orchestration SDK plus both generated clients before publish.
- Hardened money types: Compose Key atomic amounts are strings end to end; `budgetUsd` is now an exact decimal string and `budgetWei` is a positive integer string.
- Added explicit inference payment modes:
  - `auto` uses Compose Key first, then raw x402 challenge/sign/retry when a signer is available.
  - `composeKey` disables raw x402 fallback.
  - `x402` suppresses Compose Key auth and uses raw x402.
- Added provider-agnostic `x402Signer` support on the SDK constructor and per-call options.
- Added x402 payment payload encoding helpers for `PAYMENT-SIGNATURE`.
- Fixed the lazy `APIPromise` execution path so `.withResponse()` and `await` share one HTTP request instead of risking duplicate paid calls.

### Tests

- `npm run typecheck`
- `npm test` — 51 passing tests, including raw x402 negotiation and payment-mode coverage.
- `npm run build`
- `speakeasy validate openapi` and `speakeasy lint openapi` pass for both OpenAPI documents.
- `speakeasy lint arazzo` passes for `.speakeasy/tests.arazzo.yaml`.
- `speakeasy run -y --skip-upload-spec --skip-testing --output console --target x402` passes and generated `generated/x402`.
- `speakeasy run -y --skip-upload-spec --skip-testing --output console --target inference` passes and generated `generated/inference`.
- `speakeasy run -y --skip-upload-spec --skip-testing --output console --target manowar` passes and generated `generated/manowar`.

### Speakeasy generation notes

- Speakeasy's automatic generated Arazzo tests are disabled because the SDK owns hand-authored multi-source Arazzo workflows.
- `inferSSEOverload` is disabled in Speakeasy generation because Speakeasy currently emits invalid TypeScript overloads for SSE-capable operations that also document receipt headers. The generated clients expose the canonical response union/envelope shape, while the hand-written `ComposeSDK` keeps ergonomic streaming helpers.

---

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

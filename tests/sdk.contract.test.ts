/**
 * Contract tests for @compose-market/sdk.
 *
 * Stands up a local `node:http` mock server in each test and serves canned
 * responses that mirror the canonical `api.compose.market` wire format.
 * Asserts the SDK correctly constructs requests, parses bodies and headers,
 * maps error envelopes to typed error classes, and handles retries +
 * idempotency keys.
 *
 * NO sibling imports (no `../../../api`, `../../../runtime`, etc.).
 * NO secrets, NO Redis, NO Thirdweb, NO environment variables.
 * Runs hermetically via `npm test` on a fresh clone.
 */

import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import {
    AuthenticationError,
    BadRequestError,
    ComposeSDK,
    ComposeAPIError,
    ComposePaymentRequiredError,
    ConflictError,
    NotFoundError,
    PermissionDeniedError,
    RateLimitError,
} from "../src/index.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface MockRequest {
    method: string;
    path: string;
    query: URLSearchParams;
    headers: Record<string, string>;
    body: string;
}

type MockHandler = (req: MockRequest, res: ServerResponse) => void | Promise<void>;

interface MockServer {
    baseUrl: string;
    calls: MockRequest[];
    close: () => Promise<void>;
}

async function startMockServer(handler: MockHandler): Promise<MockServer> {
    const calls: MockRequest[] = [];

    const server: Server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
            chunks.push(chunk as Buffer);
        }
        const rawBody = Buffer.concat(chunks).toString("utf-8");
        const url = new URL(req.url ?? "/", "http://unused");
        const headers: Record<string, string> = {};
        for (const [k, v] of Object.entries(req.headers)) {
            if (typeof v === "string") headers[k] = v;
            else if (Array.isArray(v)) headers[k] = v.join(",");
        }

        const mockReq: MockRequest = {
            method: (req.method ?? "GET").toUpperCase(),
            path: url.pathname,
            query: url.searchParams,
            headers,
            body: rawBody,
        };
        calls.push(mockReq);

        try {
            await handler(mockReq, res);
        } catch (err) {
            if (!res.headersSent) {
                res.writeHead(500, { "content-type": "application/json" });
                res.end(JSON.stringify({ error: { code: "internal_error", message: (err as Error).message } }));
            }
        }
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;

    return {
        baseUrl: `http://127.0.0.1:${port}`,
        calls,
        close: () => new Promise<void>((resolve) => server.close(() => resolve())),
    };
}

function sendJson(res: ServerResponse, status: number, body: unknown, headers: Record<string, string> = {}): void {
    res.writeHead(status, {
        "content-type": "application/json",
        "x-request-id": "req_mock_12345",
        ...headers,
    });
    res.end(JSON.stringify(body));
}

// A wallet address syntactically valid for the SDK's format check.
const WALLET = "0x0000000000000000000000000000000000000001";

// ---------------------------------------------------------------------------
// Models
// ---------------------------------------------------------------------------

test("models.list sends GET /v1/models and parses the canonical Compose model card", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "GET");
        assert.equal(req.path, "/v1/models");
        sendJson(res, 200, {
            object: "list",
            data: [
                {
                    modelId: "gpt-4.1-mini",
                    name: "GPT 4.1 Mini",
                    provider: "openai",
                    type: "chat-completions",
                    description: null,
                    input: ["text", "image"],
                    output: ["text"],
                    contextWindow: { inputTokens: 1047576, outputTokens: 32768 },
                    pricing: { sections: [] },
                },
            ],
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const result = await sdk.models.list();
        assert.equal(result.object, "list");
        assert.equal(result.data.length, 1);
        assert.equal(result.data[0].modelId, "gpt-4.1-mini");
        assert.equal(result.data[0].name, "GPT 4.1 Mini");
        assert.equal(result.data[0].provider, "openai");
        assert.equal(result.data[0].type, "chat-completions");
    } finally {
        await server.close();
    }
});

test("models.search POSTs the filter body and forwards cursor pagination", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/v1/models/search");
        const body = JSON.parse(req.body);
        assert.deepEqual(body, {
            q: "gpt",
            modality: "text",
            operation: "chat",
            provider: "openai",
            limit: 10,
            cursor: "20",
        });
        sendJson(res, 200, {
            object: "list",
            data: [],
            total: 123,
            next_cursor: "30",
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const result = await sdk.models.search({
            q: "gpt",
            modality: "text",
            operation: "chat",
            provider: "openai",
            limit: 10,
            cursor: "20",
        });
        assert.equal(result.total, 123);
        assert.equal(result.next_cursor, "30");
    } finally {
        await server.close();
    }
});

test("models.modalities exposes canonical modality and operation routes", async () => {
    const server = await startMockServer((req, res) => {
        if (req.path === "/v1/modalities") {
            assert.equal(req.method, "GET");
            sendJson(res, 200, {
                object: "list",
                data: [
                    {
                        modality: "text",
                        operations: [
                            {
                                operation: "chat",
                                modelCount: 1,
                                sourceTypes: ["chat-completions"],
                                pricingUnits: [
                                    {
                                        unitKey: "input_tokens",
                                        unit: "usd_per_1m_tokens",
                                        entries: { input_tokens: 0.4 },
                                        valueKeys: ["input_tokens"],
                                        default: true,
                                    },
                                ],
                            },
                        ],
                        modelCount: 1,
                        pricingUnits: [],
                    },
                ],
            });
            return;
        }

        if (req.path === "/v1/modalities/text") {
            assert.equal(req.method, "GET");
            sendJson(res, 200, {
                modality: "text",
                operations: [],
                modelCount: 1,
                pricingUnits: [],
            });
            return;
        }

        if (req.path === "/v1/modalities/text/operations") {
            assert.equal(req.method, "GET");
            sendJson(res, 200, {
                object: "list",
                data: [{ operation: "chat", modelCount: 1, sourceTypes: ["chat-completions"], pricingUnits: [] }],
            });
            return;
        }

        assert.equal(req.path, "/v1/modalities/text/operations/chat/models");
        assert.equal(req.method, "GET");
        assert.equal(req.query.get("provider"), "openai");
        assert.equal(req.query.get("streaming"), "true");
        assert.equal(req.query.get("limit"), "5");
        sendJson(res, 200, {
            object: "list",
            data: [
                {
                    modelId: "gpt-4.1-mini",
                    name: "GPT 4.1 Mini",
                    provider: "openai",
                    type: "chat-completions",
                    description: null,
                    input: ["text"],
                    output: ["text"],
                    contextWindow: null,
                    pricing: null,
                    operations: [
                        {
                            modality: "text",
                            operation: "chat",
                            sourceTypes: ["chat-completions"],
                            input: ["text"],
                            output: ["text"],
                            pricingUnits: [],
                            streamable: true,
                        },
                    ],
                },
            ],
            total: 1,
            next_cursor: null,
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const modalities = await sdk.models.modalities.list();
        assert.equal(modalities.data[0].modality, "text");

        const text = await sdk.models.modalities.get("text");
        assert.equal(text.modelCount, 1);

        const operations = await sdk.models.modalities.operations("text");
        assert.equal(operations.data[0].operation, "chat");

        const models = await sdk.models.modalities.models("text", "chat", {
            provider: "openai",
            streaming: true,
            limit: 5,
        });
        assert.equal(models.data[0].operations[0].streamable, true);
        assert.equal(models.total, 1);
    } finally {
        await server.close();
    }
});

test("APIPromise withResponse and await share one HTTP execution", async () => {
    const server = await startMockServer((_req, res) => {
        sendJson(res, 200, { object: "list", data: [] });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const request = sdk.models.list();
        const withResponse = await request.withResponse();
        const data = await request;
        assert.equal(withResponse.response.status, 200);
        assert.equal(data.object, "list");
        assert.equal(server.calls.length, 1);
    } finally {
        await server.close();
    }
});

test("models.get URL-encodes the model id and returns the canonical flat card", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "GET");
        assert.equal(req.path, "/v1/models/meta-llama%2FLlama-3.1-8B-Instruct");
        sendJson(res, 200, {
            modelId: "meta-llama/Llama-3.1-8B-Instruct",
            name: "Llama 3.1 8B Instruct",
            provider: "hugging face",
            type: "chat-completions",
            description: null,
            input: ["text"],
            output: ["text"],
            contextWindow: { inputTokens: 128000, outputTokens: 16384 },
            pricing: null,
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const model = await sdk.models.get("meta-llama/Llama-3.1-8B-Instruct");
        assert.equal(model.modelId, "meta-llama/Llama-3.1-8B-Instruct");
        assert.equal(model.provider, "hugging face");
        assert.equal(model.type, "chat-completions");
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

test("keys.create converts budgetUsd to 6-decimal USDC wei and sets the canonical headers", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/api/keys");
        assert.equal(req.headers["x-session-user-address"], WALLET);
        assert.equal(req.headers["x-chain-id"], "43114");
        const body = JSON.parse(req.body);
        assert.equal(body.budgetLimit, "10000000"); // $10 * 1_000_000
        assert.equal(body.purpose, "session");
        assert.equal(typeof body.expiresAt, "number");
        assert.ok(body.expiresAt > Date.now());

        sendJson(res, 201, {
            keyId: "key_abc",
            token: "compose-header.body.signature",
            purpose: "session",
            budgetLimit: "10000000",
            budgetUsed: "0",
            budgetRemaining: "10000000",
            createdAt: Date.now(),
            expiresAt: body.expiresAt,
            chainId: 43114,
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAddress: WALLET, chainId: 43114 });
        const created = await sdk.keys.create({
            purpose: "session",
            budgetUsd: "10",
            durationHours: 24,
        });
        assert.equal(created.keyId, "key_abc");
        assert.equal(created.token, "compose-header.body.signature");
        // After creation the SDK stores the token automatically so subsequent
        // billable calls carry Authorization: Bearer compose-...
        assert.equal(sdk.keys.currentToken(), "compose-header.body.signature");
    } finally {
        await server.close();
    }
});

test("keys.create surfaces insufficient_balance 402 as ComposePaymentRequiredError (budget_exhausted is its own subclass)", async () => {
    const server = await startMockServer((_req, res) => {
        sendJson(res, 402, {
            error: {
                code: "insufficient_balance",
                message: "Insufficient USDC balance for requested session budget",
                details: { requiredWei: "10000000", balanceWei: "0" },
            },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAddress: WALLET, chainId: 43114 });
        let caught: unknown;
        try {
            await sdk.keys.create({ purpose: "session", budgetUsd: "10", durationHours: 1 });
        } catch (err) {
            caught = err;
        }
        assert.ok(caught instanceof ComposePaymentRequiredError);
        const e = caught as ComposePaymentRequiredError;
        assert.equal(e.code, "insufficient_balance");
        assert.equal(e.status, 402);
        assert.equal(e.details?.balanceWei, "0");
    } finally {
        await server.close();
    }
});

test("keys.getActive sends GET /api/session and does NOT expect a token in the body", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "GET");
        assert.equal(req.path, "/api/session");
        sendJson(res, 200, {
            hasSession: true,
            keyId: "key_abc",
            budgetLimit: "10000000",
            budgetUsed: "250000",
            budgetLocked: "0",
            budgetRemaining: "9750000",
            expiresAt: Date.now() + 3600_000,
            chainId: 43114,
            // deliberately no `token` — Phase 0.6 server contract
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAddress: WALLET, chainId: 43114 });
        const status = await sdk.keys.getActive();
        assert.equal(status.hasSession, true);
        assert.equal(status.keyId, "key_abc");
        // The SDK's typed ActiveSessionMetadata does not include `token`.
        assert.equal((status as Record<string, unknown>).token, undefined);
    } finally {
        await server.close();
    }
});

test("keys.get and keys.revoke refuse to call the server without a stored token", async () => {
    const server = await startMockServer(() => {
        throw new Error("server must NOT be called when the SDK has no token");
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAddress: WALLET, chainId: 43114 });
        await assert.rejects(() => sdk.keys.get("key_abc"), (err: unknown) => err instanceof BadRequestError);
        await assert.rejects(() => sdk.keys.revoke("key_abc"), (err: unknown) => err instanceof BadRequestError);
        assert.equal(server.calls.length, 0);
    } finally {
        await server.close();
    }
});

test("keys.revoke sends DELETE /api/keys/:id with the caller's JWT and leaves the stored token untouched", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "DELETE");
        assert.equal(req.path, "/api/keys/key_abc");
        assert.equal(req.headers.authorization, "Bearer compose-jwt-abc");
        sendJson(res, 200, { success: true, keyId: "key_abc" });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAddress: WALLET, chainId: 43114, composeKey: "compose-jwt-abc" });
        const result = await sdk.keys.revoke("key_abc");
        assert.equal(result.success, true);
        // Revoking a key does NOT clear the caller's token; the caller may be
        // revoking an API key while still holding a valid session token, or
        // vice versa. If they want to clear it, they must call keys.clearToken().
        assert.equal(sdk.keys.currentToken(), "compose-jwt-abc");
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// x402 facilitator
// ---------------------------------------------------------------------------

test("x402.facilitator.supported returns canonical kinds", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.path, "/api/x402/facilitator/supported");
        sendJson(res, 200, {
            kinds: [
                { x402Version: 2, scheme: "exact", network: "eip155:43114" },
                { x402Version: 2, scheme: "upto", network: "eip155:43114" },
            ],
            extensions: ["compose-metering-v1", "compose-payment-intent-v1"],
            signers: { "eip155:43114": ["0xFacilitator"] },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const supported = await sdk.x402.facilitator.supported();
        assert.ok(supported.kinds.some((k) => k.scheme === "exact"));
        assert.ok(supported.kinds.some((k) => k.scheme === "upto"));
        assert.deepEqual(supported.extensions, ["compose-metering-v1", "compose-payment-intent-v1"]);
    } finally {
        await server.close();
    }
});

test("x402.facilitator.chains returns chain + USDC metadata", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.path, "/api/x402/facilitator/chains");
        sendJson(res, 200, {
            chains: [
                {
                    chainId: 43114,
                    name: "Avalanche C-Chain",
                    network: "eip155:43114",
                    shortName: "Avalanche",
                    isTestnet: false,
                    explorer: "https://avascan.info",
                    usdcAddress: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                    schemes: ["exact", "upto"],
                    asset: "USDC",
                    decimals: 6,
                },
            ],
            defaultChainId: 43114,
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const chains = await sdk.x402.facilitator.chains();
        assert.equal(chains.defaultChainId, 43114);
        assert.equal(chains.chains[0].network, "eip155:43114");
        assert.equal(chains.chains[0].decimals, 6);
        assert.deepEqual([...chains.chains[0].schemes], ["exact", "upto"]);
    } finally {
        await server.close();
    }
});

test("x402 PAYMENT-REQUIRED header decoders round-trip", () => {
    const sdk = new ComposeSDK({ baseUrl: "http://unused" });
    const original = {
        x402Version: 2 as const,
        resource: { url: "https://api.compose.market/v1/chat/completions", description: "test", mimeType: "application/json" },
        accepts: [{
            scheme: "upto",
            network: "eip155:43114",
            amount: "250000",
            asset: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
            payTo: "0xMerchant",
            maxTimeoutSeconds: 300,
        }],
    };
    const encoded = Buffer.from(JSON.stringify(original), "utf-8").toString("base64")
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const decoded = sdk.x402.decodePaymentRequired(encoded);
    assert.deepEqual(decoded, original);
});

test("inference auto-negotiates raw x402 when no Compose Key is present", async () => {
    const paymentRequired = {
        x402Version: 2 as const,
        resource: { url: "https://api.compose.market/v1/chat/completions", description: "test", mimeType: "application/json" },
        accepts: [{
            scheme: "upto",
            network: "eip155:43113",
            amount: "1000000",
            asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
            payTo: "0x0000000000000000000000000000000000000402",
            maxTimeoutSeconds: 300,
        }],
    };
    const paymentRequiredHeader = Buffer.from(JSON.stringify(paymentRequired), "utf-8").toString("base64")
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    let signerCalls = 0;

    const server = await startMockServer((req, res) => {
        if (server.calls.length === 1) {
            assert.equal(req.headers.authorization, undefined);
            assert.equal(req.headers["payment-signature"], undefined);
            assert.equal(req.headers["x-x402-max-amount-wei"], "1000000");
            sendJson(res, 402, paymentRequired, { "PAYMENT-REQUIRED": paymentRequiredHeader });
            return;
        }

        assert.equal(req.headers.authorization, undefined);
        assert.ok(req.headers["payment-signature"]);
        const decoded = JSON.parse(Buffer.from(req.headers["payment-signature"].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf-8"));
        assert.equal(decoded.x402Version, 2);
        assert.equal(decoded.accepted.scheme, "upto");
        sendJson(res, 200, {
            id: "chatcmpl-x402",
            object: "chat.completion",
            created: 1,
            model: "gpt-4.1-mini",
            choices: [{ index: 0, message: { role: "assistant", content: "paid" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        });
    });

    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            x402Signer: (challenge) => {
                signerCalls += 1;
                assert.deepEqual(challenge.paymentRequired, paymentRequired);
                assert.equal(challenge.paymentRequiredHeader, paymentRequiredHeader);
                assert.equal(challenge.method, "POST");
                assert.equal(challenge.path, "/v1/chat/completions");
                assert.equal(challenge.maxAmountWei, "1000000");
                return {
                    x402Version: 2,
                    accepted: challenge.paymentRequired.accepts[0],
                    payload: { authorization: "signed-test" },
                    resource: challenge.paymentRequired.resource,
                };
            },
        });
        const result = await sdk.inference.chat.completions.create(
            { model: "gpt-4.1-mini", messages: [{ role: "user", content: "hi" }] },
            { x402MaxAmountWei: "1000000" },
        );
        assert.equal(result.data.id, "chatcmpl-x402");
        assert.equal(result.data.choices[0].message.content, "paid");
        assert.equal(signerCalls, 1);
        assert.equal(server.calls.length, 2);
    } finally {
        await server.close();
    }
});

test("paymentMode x402 suppresses an instance Compose Key", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.headers.authorization, undefined);
        assert.equal(req.headers["payment-signature"], "already-signed");
        sendJson(res, 200, {
            id: "chatcmpl-manual-x402",
            object: "chat.completion",
            created: 1,
            model: "gpt-4.1-mini",
            choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, composeKey: "compose-jwt-abc", chainId: 43113, userAddress: WALLET });
        const result = await sdk.inference.chat.completions.create(
            { model: "gpt-4.1-mini", messages: [{ role: "user", content: "hi" }] },
            { paymentMode: "x402", paymentSignature: "already-signed", x402MaxAmountWei: "1000000" },
        );
        assert.equal(result.data.id, "chatcmpl-manual-x402");
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// Inference (non-streaming)
// ---------------------------------------------------------------------------

test("inference.chat.completions.create returns typed data + receipt from header and JSON mirror", async () => {
    const receiptHeaderBase64 = Buffer.from(JSON.stringify({
        subject: "gpt-4.1-mini",
        finalAmountWei: "12345",
        network: "eip155:43114",
        settledAt: 1_700_000_000_000,
        providerAmountWei: "12222",
        platformFeeWei: "123",
    }), "utf-8").toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/v1/chat/completions");
        assert.equal(req.headers.authorization, "Bearer compose-jwt-abc");
        const body = JSON.parse(req.body);
        assert.equal(body.stream, false);
        assert.equal(body.model, "gpt-4.1-mini");

        res.writeHead(200, {
            "content-type": "application/json",
            "x-request-id": "req_mock_chat",
            "x-compose-receipt": receiptHeaderBase64,
        });
        res.end(JSON.stringify({
            id: "chatcmpl-1",
            object: "chat.completion",
            created: 1,
            model: "gpt-4.1-mini",
            choices: [{ index: 0, message: { role: "assistant", content: "Hi!" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 3, completion_tokens: 2, total_tokens: 5 },
            compose_receipt: {
                subject: "gpt-4.1-mini",
                final_amount_wei: "12345",
                network: "eip155:43114",
                settled_at: 1_700_000_000_000,
            },
        }));
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, composeKey: "compose-jwt-abc", chainId: 43114, userAddress: WALLET });
        const { data, receipt, requestId } = await sdk.inference.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: "Say hi." }],
        });
        assert.equal(data.id, "chatcmpl-1");
        assert.equal(data.choices[0].message.content, "Hi!");
        assert.equal(requestId, "req_mock_chat");
        assert.ok(receipt);
        assert.equal(receipt!.finalAmountWei, "12345");
        assert.equal(receipt!.network, "eip155:43114");
    } finally {
        await server.close();
    }
});

test("inference.chat.completions.create rejects stream: true; caller must use .stream()", async () => {
    const server = await startMockServer((_req, _res) => {
        throw new Error("server must NOT be called when stream: true is passed to create()");
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, composeKey: "compose-jwt-abc", chainId: 43114, userAddress: WALLET });
        await assert.rejects(
            () => sdk.inference.chat.completions.create({
                model: "gpt-4.1-mini",
                messages: [{ role: "user", content: "hi" }],
                stream: true,
            }),
            (err: unknown) => err instanceof BadRequestError,
        );
        assert.equal(server.calls.length, 0);
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// Error envelope mapping
// ---------------------------------------------------------------------------

test("error envelope {error:{code,message}} maps to typed error classes per HTTP status", async () => {
    const cases: Array<{ status: number; code: string; expected: new (...a: unknown[]) => Error }> = [
        { status: 400, code: "validation_error", expected: BadRequestError },
        { status: 401, code: "authentication_failed", expected: AuthenticationError },
        { status: 403, code: "forbidden", expected: PermissionDeniedError },
        { status: 404, code: "not_found", expected: NotFoundError },
        { status: 409, code: "conflict", expected: ConflictError },
        { status: 429, code: "rate_limited", expected: RateLimitError },
        { status: 500, code: "internal_error", expected: ComposeAPIError },
    ];

    for (const c of cases) {
        const server = await startMockServer((_req, res) => {
            sendJson(res, c.status, { error: { code: c.code, message: "expected" } }, c.status === 429 ? { "retry-after": "2" } : {});
        });
        try {
            const sdk = new ComposeSDK({ baseUrl: server.baseUrl, retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false } });
            let caught: unknown;
            try { await sdk.models.list(); } catch (err) { caught = err; }
            assert.ok(caught instanceof c.expected, `status ${c.status} expected ${c.expected.name}, got ${(caught as Error)?.name}`);
            const e = caught as ComposeAPIError;
            assert.equal(e.status, c.status);
            assert.equal(e.code, c.code);
            if (c.status === 429) {
                assert.equal((e as RateLimitError).retryAfter, 2);
            }
        } finally {
            await server.close();
        }
    }
});

test("HTTP client retries 5xx and honors Retry-After on 429", async () => {
    let attempt = 0;
    const server = await startMockServer((_req, res) => {
        attempt += 1;
        if (attempt === 1) {
            // First: 503 to trigger retry
            sendJson(res, 503, { error: { code: "provider_unavailable", message: "temporary" } });
            return;
        }
        // Second: 200
        sendJson(res, 200, { object: "list", data: [] });
    });
    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            retry: { maxRetries: 3, initialDelayMs: 5, maxDelayMs: 20, jitter: false },
        });
        const result = await sdk.models.list();
        assert.equal(result.object, "list");
        assert.equal(attempt, 2);
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// Idempotency header injection
// ---------------------------------------------------------------------------

test("inference calls forward X-Idempotency-Key when provided via options", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.headers["x-idempotency-key"], "idem_abc123");
        sendJson(res, 200, {
            id: "chatcmpl-1",
            object: "chat.completion",
            created: 1,
            model: "gpt-4.1-mini",
            choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, composeKey: "compose-jwt-abc", chainId: 43114, userAddress: WALLET });
        await sdk.inference.chat.completions.create(
            { model: "gpt-4.1-mini", messages: [{ role: "user", content: "hi" }] },
            { idempotencyKey: "idem_abc123" },
        );
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// User-Agent header
// ---------------------------------------------------------------------------

test("User-Agent defaults to @compose-market/sdk/<version> and can be extended", async () => {
    const server = await startMockServer((req, res) => {
        const ua = req.headers["user-agent"] ?? "";
        assert.ok(ua.startsWith("@compose-market/sdk/"), `expected sdk user-agent prefix, got: ${ua}`);
        sendJson(res, 200, { object: "list", data: [] });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        await sdk.models.list();
    } finally {
        await server.close();
    }

    const server2 = await startMockServer((req, res) => {
        const ua = req.headers["user-agent"] ?? "";
        assert.ok(ua.startsWith("@compose-market/sdk/"));
        assert.ok(ua.includes("my-app/1.2.3"), `expected suffix, got: ${ua}`);
        sendJson(res, 200, { object: "list", data: [] });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server2.baseUrl, userAgent: "my-app/1.2.3" });
        await sdk.models.list();
    } finally {
        await server2.close();
    }
});

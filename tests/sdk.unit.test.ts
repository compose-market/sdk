/**
 * Unit tests for @compose-market/sdk — no network, no mocks.
 *
 * Covers the behavior the SDK owns end-to-end:
 *   - Error hierarchy + discriminators (instanceof + code)
 *   - SSE parser with multi-frame, multi-event, [DONE] termination
 *   - Receipt header encode/decode round-trip (url-safe base64)
 *   - Webhook HMAC verification (valid, stale timestamp, tampered body)
 *   - ComposeSDK constructor input validation
 */

import assert from "node:assert/strict";
import test from "node:test";
import { createHmac } from "node:crypto";

import {
    BadRequestError,
    ComposePaymentRequiredError,
    ComposeSDK,
    ComposeTimeoutError,
    RateLimitError,
    buildApiError,
    decodeReceiptHeader,
} from "../src/index.ts";
import { parseSSEStream } from "../src/streaming/sse.ts";

// ---------------------------------------------------------------------------
// Error hierarchy
// ---------------------------------------------------------------------------

test("buildApiError selects ComposePaymentRequiredError for 402 with payment_required code", () => {
    const paymentRequired = {
        x402Version: 2 as const,
        resource: { url: "https://api.compose.market/v1/chat/completions", description: "test", mimeType: "application/json" },
        accepts: [
            {
                scheme: "exact",
                network: "eip155:43114",
                amount: "1000000",
                asset: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
                payTo: "0x2222222222222222222222222222222222222222",
                maxTimeoutSeconds: 300,
            },
        ],
    };

    const err = buildApiError({
        status: 402,
        code: "payment_required",
        message: "x-x402-max-amount-wei is required",
        paymentRequired,
    });

    assert.ok(err instanceof ComposePaymentRequiredError);
    if (!(err instanceof ComposePaymentRequiredError)) return;
    assert.equal(err.code, "payment_required");
    assert.equal(err.status, 402);
    assert.deepEqual(err.paymentRequired, paymentRequired);
});

test("buildApiError selects RateLimitError for 429 and surfaces Retry-After", () => {
    const err = buildApiError({
        status: 429,
        code: "rate_limited",
        message: "too many requests",
        retryAfter: 5,
    });
    assert.ok(err instanceof RateLimitError);
    if (!(err instanceof RateLimitError)) return;
    assert.equal(err.status, 429);
    assert.equal(err.retryAfter, 5);
});

// ---------------------------------------------------------------------------
// SSE parser
// ---------------------------------------------------------------------------

function bodyFromString(text: string): ReadableStream<Uint8Array> {
    const bytes = new TextEncoder().encode(text);
    return new ReadableStream<Uint8Array>({
        start(controller) {
            controller.enqueue(bytes);
            controller.close();
        },
    });
}

test("parseSSEStream extracts default `message` events plus named events", async () => {
    const body = bodyFromString([
        ": keep-alive\n",
        "data: {\"delta\":\"hi\"}\n\n",
        "event: compose.receipt\n",
        "data: {\"finalAmountWei\":\"100\"}\n\n",
        "data: [DONE]\n\n",
    ].join(""));

    const frames: Array<{ event: string; data: string }> = [];
    for await (const frame of parseSSEStream(body)) {
        frames.push({ event: frame.event, data: frame.data });
    }

    assert.deepEqual(frames, [
        { event: "message", data: "{\"delta\":\"hi\"}" },
        { event: "compose.receipt", data: "{\"finalAmountWei\":\"100\"}" },
        { event: "message", data: "[DONE]" },
    ]);
});

test("parseSSEStream joins multi-line data payloads with newlines", async () => {
    const body = bodyFromString("data: line1\ndata: line2\ndata: line3\n\n");
    const frames = [];
    for await (const frame of parseSSEStream(body)) {
        frames.push(frame);
    }
    assert.equal(frames.length, 1);
    assert.equal(frames[0].data, "line1\nline2\nline3");
});

test("parseSSEStream tolerates CRLF line endings and flushes a trailing frame without blank-line terminator", async () => {
    const body = bodyFromString("data: one\r\n\r\ndata: two\r\n");
    const frames = [];
    for await (const frame of parseSSEStream(body)) {
        frames.push(frame.data);
    }
    assert.deepEqual(frames, ["one", "two"]);
});

// ---------------------------------------------------------------------------
// Receipt round-trip
// ---------------------------------------------------------------------------

test("decodeReceiptHeader round-trips through encodeReceiptHeader shape", async () => {
    // Manually encode to mirror what the server emits (url-safe base64 of JSON).
    const receipt = {
        subject: "gpt-4.1-mini",
        finalAmountWei: "12345",
        network: "eip155:43114" as const,
        settledAt: 1_700_000_000_000,
        lineItems: [
            { key: "input_tokens", unit: "usd_per_1m_tokens", quantity: 10, unitPriceUsd: 0.3, amountWei: "3" },
        ],
        providerAmountWei: "12000",
        platformFeeWei: "345",
        txHash: "0xdeadbeef",
    };
    const json = JSON.stringify(receipt);
    const base64 = Buffer.from(json, "utf-8").toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
    const decoded = decodeReceiptHeader(base64);
    assert.deepEqual(decoded, receipt);
});

// ---------------------------------------------------------------------------
// Webhook HMAC
// ---------------------------------------------------------------------------

test("webhooks.verify accepts a correctly signed event and rejects tampered body", async () => {
    const sdk = new ComposeSDK();
    const secret = "whsec_test";
    const body = JSON.stringify({ type: "settlement.succeeded", data: { amount: "123" }, timestamp: Date.now() });
    const timestamp = Math.floor(Date.now() / 1000);
    const v1 = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");

    const signature = `t=${timestamp},v1=${v1}`;
    const ok = await sdk.webhooks.verify({ body, signature, secret });
    assert.equal(ok, true);

    const tampered = body.replace("123", "456");
    const bad = await sdk.webhooks.verify({ body: tampered, signature, secret });
    assert.equal(bad, false);
});

test("webhooks.verify rejects stale timestamp outside the tolerance window", async () => {
    const sdk = new ComposeSDK();
    const secret = "whsec_test";
    const body = JSON.stringify({ type: "settlement.succeeded" });
    const oldTimestamp = Math.floor(Date.now() / 1000) - 1_000;
    const v1 = createHmac("sha256", secret).update(`${oldTimestamp}.${body}`).digest("hex");
    const signature = `t=${oldTimestamp},v1=${v1}`;

    const ok = await sdk.webhooks.verify({ body, signature, secret, toleranceSeconds: 60 });
    assert.equal(ok, false);
});

// ---------------------------------------------------------------------------
// Constructor validation
// ---------------------------------------------------------------------------

test("ComposeSDK constructor rejects malformed userAddress synchronously", () => {
    assert.throws(
        () => new ComposeSDK({ userAddress: "not-a-wallet", chainId: 43114 }),
        (err: unknown) => err instanceof BadRequestError,
    );
});

test("ComposeSDK constructor accepts a valid EVM address and normalizes casing", () => {
    const sdk = new ComposeSDK({
        userAddress: "0xABCDEF0123456789abcdef0123456789abcdef01",
        chainId: 43114,
    });
    const current = sdk.wallets.current();
    assert.equal(current.address, "0xabcdef0123456789abcdef0123456789abcdef01");
    assert.equal(current.chainId, 43114);
});

test("ComposeSDK throws BadRequestError when a billable call is attempted with no wallet context", async () => {
    const sdk = new ComposeSDK({ baseUrl: "http://127.0.0.1:1" });
    await assert.rejects(
        () => sdk.keys.create({ purpose: "session", budgetUsd: 1, durationHours: 1 }),
        (err: unknown) => err instanceof BadRequestError,
    );
});

test("ComposeTimeoutError surfaces when the server is unreachable within the timeout", async () => {
    // Stand up a socket that accepts connections but never writes a response.
    // This lets us assert that the SDK times out cleanly rather than hanging.
    const { createServer } = await import("node:net");
    const sockets: Array<{ destroy: () => void }> = [];
    const server = createServer((socket) => { sockets.push(socket); });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as { port: number };

    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            timeoutMs: 50,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });
        await assert.rejects(
            () => sdk.models.list(),
            (err: unknown) => {
                if (err instanceof ComposeTimeoutError) return true;
                // Some fetch impls surface abort as ConnectionError; accept either.
                return err instanceof Error && /abort|timeout|timed out/i.test(err.message);
            },
        );
    } finally {
        for (const s of sockets) try { s.destroy(); } catch { /* */ }
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

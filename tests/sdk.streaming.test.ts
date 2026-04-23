/**
 * End-to-end streaming tests for the SDK.
 *
 * Stands up a synthetic SSE endpoint (NOT the production Compose gateway,
 * because those routes require paid inference) and asserts the SDK's
 * streaming iterators correctly:
 *   - Assemble chat.completion.chunk frames into a final ChatCompletion
 *   - Surface reasoning_content deltas through the stream
 *   - Aggregate tool_calls across chunks
 *   - Parse the terminal `compose.receipt` SSE frame into a typed receipt
 *   - Stop iteration on `[DONE]`
 */

import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import { ComposeSDK } from "../src/index.ts";

type SSEFrame = { event?: string; data: string };

function makeSSEBody(frames: SSEFrame[]): string {
    return frames
        .map((frame) => {
            const parts: string[] = [];
            if (frame.event) parts.push(`event: ${frame.event}`);
            parts.push(`data: ${frame.data}`);
            parts.push("");
            return parts.join("\n");
        })
        .join("\n") + "\n";
}

async function withStreamingServer<T>(
    frames: SSEFrame[],
    run: (sdk: ComposeSDK) => Promise<T>,
): Promise<T> {
    const server = createServer((req, res) => {
        res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Request-Id": "req_stream_test",
        });
        res.end(makeSSEBody(frames));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    const sdk = new ComposeSDK({
        baseUrl: `http://127.0.0.1:${port}`,
        retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
    });
    try {
        return await run(sdk);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
}

test("chat.completions.stream aggregates content deltas + tool_calls + reasoning + receipt", async () => {
    const reqId = "chatcmpl-test-1";
    const frames: SSEFrame[] = [
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: { role: "assistant", reasoning_content: "let me think..." }, finish_reason: null }],
        }) },
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: { content: "Hello" }, finish_reason: null }],
        }) },
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: { content: ", world!" }, finish_reason: null }],
        }) },
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: "tc_1", type: "function", function: { name: "search", arguments: "{\"q\":" } }] }, finish_reason: null }],
        }) },
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: "\"kittens\"}" } }] }, finish_reason: null }],
        }) },
        { data: JSON.stringify({
            id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
            choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }],
            usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
        }) },
        { event: "compose.receipt", data: JSON.stringify({
            finalAmountWei: "12345",
            providerAmountWei: "12222",
            platformFeeWei: "123",
            meterSubject: "gpt-4.1-mini",
            network: "eip155:43114",
            settledAt: 1_700_000_000_000,
        }) },
        { data: "[DONE]" },
    ];

    await withStreamingServer(frames, async (sdk) => {
        const stream = sdk.inference.chat.completions.stream({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: "hi" }],
        });

        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        assert.equal(chunks.length, 6);

        const final = await stream.final();
        assert.equal(final.chatCompletion.id, reqId);
        assert.equal(final.chatCompletion.choices[0].message.content, "Hello, world!");
        assert.equal(final.chatCompletion.choices[0].finish_reason, "tool_calls");
        assert.deepEqual(final.chatCompletion.choices[0].message.tool_calls, [
            { id: "tc_1", type: "function", function: { name: "search", arguments: "{\"q\":\"kittens\"}" } },
        ]);
        assert.deepEqual(final.chatCompletion.usage, { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 });

        assert.ok(final.receipt);
        assert.equal(final.receipt!.finalAmountWei, "12345");
        assert.equal(final.receipt!.subject, "gpt-4.1-mini");
        assert.equal(final.receipt!.network, "eip155:43114");

        assert.equal(final.requestId, "req_stream_test");
    });
});

test("responses.stream yields output_text.delta events and resolves with receipt", async () => {
    const respId = "resp_test_1";
    const frames: SSEFrame[] = [
        { data: JSON.stringify({ type: "response.output_text.delta", response_id: respId, model: "gpt-4.1-mini", delta: "Hello" }) },
        { data: JSON.stringify({ type: "response.output_text.delta", response_id: respId, model: "gpt-4.1-mini", delta: ", world!" }) },
        { data: JSON.stringify({ type: "response.completed", response_id: respId, model: "gpt-4.1-mini", finish_reason: "stop", usage: { input_tokens: 5, output_tokens: 7, total_tokens: 12 } }) },
        { event: "compose.receipt", data: JSON.stringify({ finalAmountWei: "999", network: "eip155:43114", settledAt: 1 }) },
        { data: "[DONE]" },
    ];

    await withStreamingServer(frames, async (sdk) => {
        const stream = sdk.inference.responses.stream({
            model: "gpt-4.1-mini",
            input: "hi",
        });

        const events = [];
        for await (const event of stream) {
            events.push(event);
        }

        assert.equal(events.length, 3);
        assert.equal(events[0].type, "response.output_text.delta");
        assert.equal(events[2].type, "response.completed");

        const final = await stream.final();
        assert.equal(final.receipt?.finalAmountWei, "999");
        assert.equal(final.response?.id, respId);
        assert.equal(final.response?.status, "completed");
        assert.deepEqual(final.response?.usage, { input_tokens: 5, output_tokens: 7, total_tokens: 12 });
    });
});

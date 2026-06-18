/**
 * End-to-end streaming tests for the SDK.
 *
 * Stands up a synthetic SSE endpoint (NOT the production Compose gateway,
 * because those routes require paid inference) and asserts the SDK's
 * streaming iterators correctly:
 *   - Assemble chat.completion.chunk frames into a final ChatCompletion
 *   - Surface reasoning_content deltas through the stream
 *   - Aggregate tool_calls across chunks
 *   - Parse terminal `receipt` SSE frames into typed receipts
 *   - Keep Compose terminal metadata available even when it follows `[DONE]`
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
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: { role: "assistant", reasoning_content: "let me think..." }, finish_reason: null }],
            })
        },
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: { content: "Hello" }, finish_reason: null }],
            })
        },
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: { content: ", world!" }, finish_reason: null }],
            })
        },
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: { tool_calls: [{ index: 0, id: "tc_1", type: "function", function: { name: "search", arguments: "{\"q\":" } }] }, finish_reason: null }],
            })
        },
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: { tool_calls: [{ index: 0, function: { arguments: "\"kittens\"}" } }] }, finish_reason: null }],
            })
        },
        {
            data: JSON.stringify({
                id: reqId, object: "chat.completion.chunk", created: 1, model: "gpt-4.1-mini",
                choices: [{ index: 0, delta: {}, finish_reason: "tool_calls" }],
                usage: { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 },
            })
        },
        { data: "[DONE]" },
        {
            event: "receipt", data: JSON.stringify({
                user: "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
                runId: "run_stream_test",
                duration: "12s",
                bills: [{
                    agent: "Test Agent",
                    agentWallet: "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
                    depth: 0,
                    model: "gpt-4.1-mini",
                    tokens: { input: 10, output: 20 },
                    tools: ["models_call"],
                    total: "0.012345 USDC",
                    duration: "12s",
                    txId: "0xagentsettlement",
                    fees: {
                        total: { percent: "2%", amount: "0.000123 USDC" },
                        distribution: { Compose: "0.000061 USDC", Creator: "0.000062 USDC" },
                    },
                }],
            })
        },
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
        assert.equal(chunks.filter((event) => event.type === "model.text.delta").map((event) => event.delta).join(""), "Hello, world!");
        assert.equal(chunks.filter((event) => event.type === "model.reasoning.delta").map((event) => event.delta).join(""), "let me think...");

        const final = await stream.final();
        assert.equal(final.chatCompletion.id, reqId);
        assert.equal(final.chatCompletion.choices[0].message.content, "Hello, world!");
        assert.equal(final.chatCompletion.choices[0].finish_reason, "tool_calls");
        assert.deepEqual(final.chatCompletion.choices[0].message.tool_calls, [
            { id: "tc_1", type: "function", function: { name: "search", arguments: "{\"q\":\"kittens\"}" } },
        ]);
        assert.deepEqual(final.chatCompletion.usage, { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 });

        assert.ok(final.receipt);
        assert.equal(final.receipt!.user, "0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
        assert.equal(final.receipt!.runId, "run_stream_test");
        assert.equal(final.receipt!.duration, "12s");
        assert.equal(final.receipt!.bills?.[0].agent, "Test Agent");
        assert.equal(final.receipt!.bills?.[0].agentWallet, "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        assert.equal(final.receipt!.bills?.[0].model, "gpt-4.1-mini");
        assert.equal(final.receipt!.bills?.[0].tokens.input, 10);
        assert.deepEqual(final.receipt!.bills?.[0].tools, ["models_call"]);
        assert.equal(final.receipt!.bills?.[0].total, "0.012345 USDC");
        assert.equal(final.receipt!.bills?.[0].fees.distribution.Compose, "0.000061 USDC");

        assert.equal(final.requestId, "req_stream_test");
    });
});

test("responses.stream yields output_text.delta events and resolves with receipt", async () => {
    const respId = "resp_test_1";
    const frames: SSEFrame[] = [
        { data: JSON.stringify({ type: "response.output_text.delta", response_id: respId, model: "gpt-4.1-mini", delta: "Hello" }) },
        { data: JSON.stringify({ type: "response.output_text.delta", response_id: respId, model: "gpt-4.1-mini", delta: ", world!" }) },
        { data: JSON.stringify({ type: "response.completed", response_id: respId, model: "gpt-4.1-mini", finish_reason: "stop", usage: { input_tokens: 5, output_tokens: 7, total_tokens: 12 } }) },
        { data: "[DONE]" },
        { event: "receipt", data: JSON.stringify({ user: "0xuser", runId: "run_resp", duration: "1s", bills: [] }) },
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

        assert.equal(events.filter((event) => event.type === "model.text.delta").map((event) => event.delta).join(""), "Hello, world!");
        assert.ok(events.some((event) => event.type === "model.done" && event.status === "completed"));
        assert.equal(events.every((event) => event.domain === "model"), true);

        const final = await stream.final();
        assert.equal(final.receipt?.runId, "run_resp");
        assert.equal(final.response?.id, respId);
        assert.equal(final.response?.status, "completed");
        assert.deepEqual(final.response?.usage, { input_tokens: 5, output_tokens: 7, total_tokens: 12 });
    });
});

test("responses.stream yields partial-image + completed-image events", async () => {
    const respId = "resp_img_1";
    const frames: SSEFrame[] = [
        { data: JSON.stringify({ type: "response.image_generation_call.partial_image", response_id: respId, model: "gpt-image-1", partial_image_index: 0, partial_image_b64: "AAA" }) },
        { data: JSON.stringify({ type: "response.image_generation_call.partial_image", response_id: respId, model: "gpt-image-1", partial_image_index: 1, partial_image_b64: "BBB" }) },
        { data: JSON.stringify({ type: "response.image_generation_call.completed", response_id: respId, model: "gpt-image-1", image_b64: "CCC", mime_type: "image/png", revised_prompt: "cat" }) },
        { data: JSON.stringify({ type: "response.completed", response_id: respId, model: "gpt-image-1", finish_reason: "stop", usage: { input_tokens: 5, output_tokens: 7, total_tokens: 12 } }) },
        { data: "[DONE]" },
    ];

    await withStreamingServer(frames, async (sdk) => {
        const stream = sdk.inference.responses.stream({
            model: "gpt-image-1",
            input: "draw a cat",
            modalities: ["image"],
        });

        const events = [];
        for await (const event of stream) {
            events.push(event);
        }

        assert.equal(events.filter((event) => event.type === "model.asset" && event.status === "running").length, 2);
        assert.ok(events.some((event) => event.type === "model.asset" && event.status === "completed"));
        assert.equal(events.every((event) => event.domain === "model"), true);

        const final = await stream.final();
        assert.equal(final.response?.id, respId);
        assert.equal(final.response?.status, "completed");
    });
});

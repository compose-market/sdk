/**
 * Contract tests for SDK v0.4 additions:
 *   - sdk.agent.stream — agent runtime SSE vocabulary
 *   - sdk.workflow.stream — workflow runtime SSE vocabulary
 *   - Unified toolCallStart/toolCallEnd across chat/responses/agent/workflow
 *   - ResponsesStreamFinalResult.toolCalls aggregation
 *
 * Hermetic. In-test node:http servers emit scripted frames; no sibling
 * imports, no secrets, no external deps.
 */

import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import {
    ComposeSDK,
    type AgentRuntimeEvent,
    type WorkflowRuntimeEvent,
    type ToolCallLifecycleEvent,
} from "../src/index.ts";

const WALLET = "0x0000000000000000000000000000000000000001";

function encodePaymentRequiredHeader(value: unknown): string {
    return Buffer.from(JSON.stringify(value), "utf-8").toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

async function withRuntimeSSEServer(
    writer: (req: IncomingMessage, res: ServerResponse, bodyText: string) => void | Promise<void>,
    run: (baseUrl: string) => Promise<void>,
): Promise<void> {
    const server: Server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        await writer(req, res, Buffer.concat(chunks).toString("utf-8"));
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        await run(`http://127.0.0.1:${port}`);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
}

test("sdk.agent.stream yields text/thinking/tool events and aggregates toolCalls", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_agent_1",
            });
            res.write(`data: ${JSON.stringify({ type: "thinking_start", message: "Planning approach..." })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "thinking_end" })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "tool_start", toolName: "web_search", content: "query: cats" })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "tool_end", toolName: "web_search", message: "3 results" })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "reasoning_delta", delta: "Need to summarize search results." })}\n\n`);
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: "Here are" } }] })}\n\n`);
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: " the results." } }] })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                composeKey: "compose-jwt-abc",
            });
            const toolEvents: ToolCallLifecycleEvent[] = [];
            sdk.events.on("toolCallStart", (e) => toolEvents.push(e));
            sdk.events.on("toolCallEnd", (e) => toolEvents.push(e));

            const stream = sdk.agent.stream({
                agentWallet: "0xagent",
                message: "hi",
                threadId: "t1",
                userAddress: WALLET,
            });
            const events: AgentRuntimeEvent[] = [];
            for await (const ev of stream) events.push(ev);

            // thinking-start / thinking-end / tool-start / tool-end / reasoning / 2x text-delta / done
            assert.equal(events.length, 8);
            assert.equal(events[0].type, "thinking-start");
            assert.equal(events[2].type, "tool-start");
            assert.equal(events[3].type, "tool-end");
            assert.deepEqual(events[4], { type: "reasoning-delta", delta: "Need to summarize search results." });
            const textDeltas = events.filter((e) => e.type === "text-delta");
            assert.equal(textDeltas.length, 2);

            const final = await stream.final();
            assert.equal(final.text, "Here are the results.");
            assert.equal(final.toolCalls.length, 1);
            assert.equal(final.toolCalls[0].toolName, "web_search");
            assert.equal(final.requestId, "req_agent_1");

            // Unified toolCallStart + toolCallEnd fired on the bus
            const starts = toolEvents.filter((e) => "failed" in e === false || e.failed === undefined);
            // At minimum one start + one end must have fired.
            assert.ok(toolEvents.length >= 2);
            const agentToolEvents = toolEvents.filter((e) => e.source === "agent");
            assert.equal(agentToolEvents.length, 2);
            assert.equal(agentToolEvents[0].toolName, "web_search");
            void starts;
        },
    );
});

test("sdk.agent.stream negotiates x402 upto payments with x402MaxAmountWei", async () => {
    const paymentRequired = {
        x402Version: 2 as const,
        resource: { url: "http://runtime.test/agent/0xagent/stream", description: "Agent stream" },
        accepts: [{
            scheme: "upto",
            network: "eip155:43114",
            amount: "1000000",
            asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
            payTo: "0x0000000000000000000000000000000000000402",
            maxTimeoutSeconds: 300,
        }],
    };
    const paymentRequiredHeader = encodePaymentRequiredHeader(paymentRequired);
    let calls = 0;
    let signerCalls = 0;

    await withRuntimeSSEServer(
        (req, res) => {
            calls += 1;
            if (calls === 1) {
                assert.equal(req.headers["x-x402-max-amount-wei"], "1000000");
                assert.equal(req.headers.authorization, undefined);
                assert.equal(req.headers["payment-signature"], undefined);
                res.writeHead(402, {
                    "content-type": "application/json",
                    "PAYMENT-REQUIRED": paymentRequiredHeader,
                });
                res.end(JSON.stringify(paymentRequired));
                return;
            }

            assert.ok(req.headers["payment-signature"]);
            assert.equal(req.headers.authorization, undefined);
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_agent_x402",
            });
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: "paid agent" } }] })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            res.write(`event: compose.receipt\ndata: ${JSON.stringify({
                finalAmountWei: "8836",
                txHash: "0xagentsettlement",
                network: "eip155:43114",
                settledAt: 1_777_339_956_538,
            })}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                x402Signer: (challenge) => {
                    signerCalls += 1;
                    assert.deepEqual(challenge.paymentRequired, paymentRequired);
                    assert.equal(challenge.paymentRequiredHeader, paymentRequiredHeader);
                    assert.equal(challenge.method, "POST");
                    assert.equal(challenge.path, "/agent/0xagent/stream");
                    assert.equal(challenge.maxAmountWei, "1000000");
                    return {
                        x402Version: 2,
                        accepted: challenge.paymentRequired.accepts[0],
                        payload: { authorization: "signed-agent" },
                        resource: challenge.paymentRequired.resource,
                    };
                },
            });

            const stream = sdk.agent.stream({
                agentWallet: "0xagent",
                message: "hi",
                threadId: "t1",
                userAddress: WALLET,
            }, { paymentMode: "x402", x402MaxAmountWei: "1000000" });

            const events: AgentRuntimeEvent[] = [];
            for await (const ev of stream) events.push(ev);
            const final = await stream.final();
            assert.equal(final.text, "paid agent");
            assert.equal(final.receipt?.finalAmountWei, "8836");
            assert.equal(final.receipt?.txHash, "0xagentsettlement");
            assert.equal(signerCalls, 1);
            assert.equal(calls, 2);
        },
    );
});

test("sdk.agent.stream treats runtime done as terminal even when the socket closes later", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_agent_open_socket",
            });
            res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: "finished" } }] })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            setTimeout(() => res.end(), 1_000);
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                composeKey: "compose-jwt-abc",
            });

            const stream = sdk.agent.stream({
                agentWallet: "0xagent",
                message: "hi",
                threadId: "t-open",
                userAddress: WALLET,
            });
            const started = Date.now();
            const events: AgentRuntimeEvent[] = [];
            for await (const ev of stream) events.push(ev);
            const final = await stream.final();

            assert.ok(Date.now() - started < 900);
            assert.equal(events.at(-1)?.type, "done");
            assert.equal(final.text, "finished");
        },
    );
});

test("sdk.workflow.stream yields lifecycle events and emits toolCallStart/End", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_wf_1",
            });
            res.write(`event: start\ndata: ${JSON.stringify({ message: "Starting workflow" })}\n\n`);
            res.write(`event: step\ndata: ${JSON.stringify({ stepName: "Extract", message: "Extracting inputs" })}\n\n`);
            res.write(`event: tool_start\ndata: ${JSON.stringify({ toolName: "scraper", content: "fetching url" })}\n\n`);
            res.write(`event: tool_end\ndata: ${JSON.stringify({ toolName: "scraper", message: "200 OK" })}\n\n`);
            res.write(`event: result\ndata: ${JSON.stringify({ output: { type: "text", value: "done" } })}\n\n`);
            res.write(`event: complete\ndata: ${JSON.stringify({ message: "Workflow complete!" })}\n\n`);
            res.write(`event: done\ndata: ${JSON.stringify({})}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                composeKey: "compose-jwt-abc",
            });
            const toolEvents: ToolCallLifecycleEvent[] = [];
            sdk.events.on("toolCallStart", (e) => toolEvents.push(e));
            sdk.events.on("toolCallEnd", (e) => toolEvents.push(e));

            const stream = sdk.workflow.stream({
                workflowWallet: "0xwf",
                message: "run",
                threadId: "w1",
                userAddress: WALLET,
            });
            const events: WorkflowRuntimeEvent[] = [];
            for await (const ev of stream) events.push(ev);

            assert.equal(events[0].type, "start");
            assert.equal(events[1].type, "step");
            assert.equal(events[2].type, "tool-start");
            assert.equal(events[3].type, "tool-end");
            assert.equal(events[4].type, "result");
            assert.equal(events[5].type, "complete");
            assert.equal(events[6].type, "done");

            const final = await stream.final();
            assert.equal(final.toolCalls.length, 1);
            assert.equal(final.toolCalls[0].toolName, "scraper");
            assert.deepEqual(final.structuredOutput, { type: "text", value: "done" });

            const wfTools = toolEvents.filter((e) => e.source === "workflow");
            assert.equal(wfTools.length, 2);
        },
    );
});

test("sdk.workflow.stream negotiates x402 upto payments with x402MaxAmountWei", async () => {
    const paymentRequired = {
        x402Version: 2 as const,
        resource: { url: "http://runtime.test/workflow/0xworkflow/chat", description: "Workflow stream" },
        accepts: [{
            scheme: "upto",
            network: "eip155:43114",
            amount: "2000000",
            asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
            payTo: "0x0000000000000000000000000000000000000402",
            maxTimeoutSeconds: 300,
        }],
    };
    const paymentRequiredHeader = encodePaymentRequiredHeader(paymentRequired);
    let calls = 0;
    let signerCalls = 0;

    await withRuntimeSSEServer(
        (req, res) => {
            calls += 1;
            if (calls === 1) {
                assert.equal(req.headers["x-x402-max-amount-wei"], "2000000");
                res.writeHead(402, {
                    "content-type": "application/json",
                    "PAYMENT-REQUIRED": paymentRequiredHeader,
                });
                res.end(JSON.stringify(paymentRequired));
                return;
            }

            assert.ok(req.headers["payment-signature"]);
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_workflow_x402",
            });
            res.write(`event: result\ndata: ${JSON.stringify({ output: { value: "paid workflow" } })}\n\n`);
            res.write(`event: done\ndata: ${JSON.stringify({})}\n\n`);
            res.write(`event: compose.receipt\ndata: ${JSON.stringify({
                finalAmountWei: "14421",
                txHash: "0xworkflowsettlement",
                network: "eip155:43114",
                settledAt: 1_777_339_956_539,
            })}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                x402Signer: (challenge) => {
                    signerCalls += 1;
                    assert.equal(challenge.path, "/workflow/0xworkflow/chat");
                    assert.equal(challenge.maxAmountWei, "2000000");
                    return {
                        x402Version: 2,
                        accepted: challenge.paymentRequired.accepts[0],
                        payload: { authorization: "signed-workflow" },
                        resource: challenge.paymentRequired.resource,
                    };
                },
            });

            const stream = sdk.workflow.stream({
                workflowWallet: "0xworkflow",
                message: "hi",
                threadId: "wf1",
                userAddress: WALLET,
            }, { paymentMode: "x402", x402MaxAmountWei: "2000000" });

            const events: WorkflowRuntimeEvent[] = [];
            for await (const ev of stream) events.push(ev);
            const final = await stream.final();
            assert.deepEqual(final.structuredOutput, { value: "paid workflow" });
            assert.equal(final.receipt?.finalAmountWei, "14421");
            assert.equal(final.receipt?.txHash, "0xworkflowsettlement");
            assert.equal(signerCalls, 1);
            assert.equal(calls, 2);
        },
    );
});

test("agent lifecycle events fire on sdk.events.agentStreamStart / End", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, { "content-type": "text/event-stream" });
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                composeKey: "compose-jwt-abc",
            });
            const lifecycle: string[] = [];
            sdk.events.on("agentStreamStart", () => lifecycle.push("start"));
            sdk.events.on("agentStreamEnd", () => lifecycle.push("end"));

            const stream = sdk.agent.stream({
                agentWallet: "0xagent",
                message: "hi",
                threadId: "t1",
                userAddress: WALLET,
            });
            for await (const _ of stream) { void _; }
            await stream.final();

            assert.deepEqual(lifecycle, ["start", "end"]);
        },
    );
});

test("ResponsesStreamFinalResult aggregates tool_call + tool_call.delta frames", async () => {
    const { createServer: createBareServer } = await import("node:http");
    const bareServer = createBareServer((_req, res) => {
        res.writeHead(200, { "content-type": "text/event-stream", "x-request-id": "req_resp_tools_1" });
        res.write(`data: ${JSON.stringify({ type: "response.tool_call", response_id: "r1", model: "gpt-4.1-mini", tool_call: { id: "call_1", name: "search", arguments: "" } })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "response.tool_call.delta", response_id: "r1", model: "gpt-4.1-mini", index: 0, delta: { id: "call_1", arguments: '{"q":' } })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "response.tool_call.delta", response_id: "r1", model: "gpt-4.1-mini", index: 0, delta: { id: "call_1", arguments: '"kittens"}' } })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: "response.completed", response_id: "r1", model: "gpt-4.1-mini", finish_reason: "tool_calls" })}\n\n`);
        res.write(`data: [DONE]\n\n`);
        res.end();
    });
    await new Promise<void>((resolve) => bareServer.listen(0, "127.0.0.1", () => resolve()));
    const { port } = bareServer.address() as AddressInfo;

    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            composeKey: "compose-jwt-abc",
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });
        const seen: ToolCallLifecycleEvent[] = [];
        sdk.events.on("toolCallStart", (e) => seen.push(e));
        sdk.events.on("toolCallEnd", (e) => seen.push(e));

        const stream = sdk.inference.responses.stream({
            model: "gpt-4.1-mini",
            input: "hi",
        });
        const events = [];
        for await (const ev of stream) events.push(ev);

        const final = await stream.final();
        assert.equal(final.toolCalls.length, 1);
        assert.equal(final.toolCalls[0].id, "call_1");
        assert.equal(final.toolCalls[0].name, "search");
        assert.equal(final.toolCalls[0].arguments, '{"q":"kittens"}');

        const respToolEvents = seen.filter((e) => e.source === "responses");
        assert.ok(respToolEvents.length >= 1, "responses stream must emit at least one tool event");
    } finally {
        await new Promise<void>((resolve) => bareServer.close(() => resolve()));
    }
});

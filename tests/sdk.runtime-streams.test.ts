import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import {
    ComposeSDK,
    createActivityState,
    reduceActivityState,
    type ModelEvent,
    type RunEvent,
    type ToolCallLifecycleEvent,
    type WorkflowEvent,
} from "../src/index.ts";

const WALLET = "0x0000000000000000000000000000000000000001";

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

test("sdk.agent.stream yields ordered activity/model events and preserves final aggregation", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, {
                "content-type": "text/event-stream",
                "x-request-id": "req_agent_1",
            });
            res.write(`data: ${JSON.stringify({ type: "thinking_start", message: "Planning approach..." })}\n\n`);
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
            const events: RunEvent[] = [];
            for await (const ev of stream) events.push(ev);

            assert.ok(events.some((event) => event.domain === "activity" && event.type === "activity.thinking"));
            assert.ok(events.some((event) => event.domain === "activity" && event.type === "activity.tool" && event.status === "running"));
            assert.ok(events.some((event) => event.domain === "activity" && event.type === "activity.tool" && event.status === "completed"));
            assert.ok(events.some((event) => event.domain === "model" && event.type === "model.reasoning.delta"));
            assert.equal(events.filter((event) => event.domain === "model" && event.type === "model.text.delta").map((event) => event.delta).join(""), "Here are the results.");

            const final = await stream.final();
            assert.equal(final.text, "Here are the results.");
            assert.equal(final.toolCalls.length, 1);
            assert.equal(final.toolCalls[0].toolName, "web_search");
            assert.equal(final.requestId, "req_agent_1");
            assert.equal(toolEvents.filter((event) => event.source === "agent").length, 2);
        },
    );
});

test("sdk.agent.stream reduces proposal and child-agent frames into one tree", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, { "content-type": "text/event-stream" });
            res.write(`data: ${JSON.stringify({
                type: "harness_plan_proposed",
                proposalId: "prop_1",
                version: 1,
                state: "awaiting_approval",
                composeRunId: "run_parent",
                rootComposeRunId: "root_1",
                markdown: "# Plan",
            })}\n\n`);
            res.write(`data: ${JSON.stringify({
                type: "swarm_child_start",
                parentRunId: "run_parent",
                rootComposeRunId: "root_1",
                runKey: "child_1",
                agentWallet: "0xchild",
                runKeyChain: ["run_parent", "child_1"],
            })}\n\n`);
            res.write(`data: ${JSON.stringify({
                type: "swarm_child_delta",
                parentRunId: "run_parent",
                runKey: "child_1",
                delta: "child response",
                runKeyChain: ["run_parent", "child_1"],
            })}\n\n`);
            res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({ baseUrl, userAddress: WALLET, chainId: 43114, composeKey: "compose-jwt-abc" });
            const stream = sdk.agent.stream({
                agentWallet: "0xagent",
                message: "plan",
                threadId: "t1",
                userAddress: WALLET,
                composeRunId: "run_parent",
            });

            let state = createActivityState();
            for await (const event of stream) {
                if (event.domain === "activity") state = reduceActivityState(state, event);
            }

            const approval = Object.values(state.nodes).find((node) => node.kind === "plan");
            const child = Object.values(state.nodes).find((node) => node.kind === "agent" && node.id.includes("child_1"));
            const childText = Object.values(state.nodes).find((node) => node.kind === "message" && node.parentId === child?.id);

            assert.equal(approval?.payload?.proposalId, "prop_1");
            assert.ok(child);
            assert.equal(childText?.text, "child response");
        },
    );
});

test("sdk.workflow.stream yields workflow action/tool/result events", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, { "content-type": "text/event-stream", "x-request-id": "req_workflow_1" });
            res.write(`event: start\ndata: ${JSON.stringify({ message: "Starting" })}\n\n`);
            res.write(`event: step\ndata: ${JSON.stringify({ stepName: "collect", message: "Collecting" })}\n\n`);
            res.write(`event: tool_start\ndata: ${JSON.stringify({ toolName: "lookup", content: "query" })}\n\n`);
            res.write(`event: tool_end\ndata: ${JSON.stringify({ toolName: "lookup", message: "done" })}\n\n`);
            res.write(`event: result\ndata: ${JSON.stringify({ output: "workflow result" })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({ baseUrl, userAddress: WALLET, chainId: 43114, composeKey: "compose-jwt-abc" });
            const stream = sdk.workflow.stream({
                workflowWallet: "0xworkflow",
                message: "run",
                threadId: "t1",
                userAddress: WALLET,
            });

            const events: WorkflowEvent[] = [];
            for await (const event of stream) events.push(event);
            assert.ok(events.some((event) => event.domain === "activity" && event.kind === "run"));
            assert.ok(events.some((event) => event.domain === "activity" && event.kind === "tool"));
            assert.ok(events.some((event) => event.domain === "activity" && event.kind === "message" && event.delta === "workflow result"));

            const final = await stream.final();
            assert.equal(final.text, "workflow result");
            assert.equal(final.requestId, "req_workflow_1");
        },
    );
});

test("sdk.workflow.stream preserves real nested model asset events", async () => {
    await withRuntimeSSEServer(
        (_req, res) => {
            res.writeHead(200, { "content-type": "text/event-stream", "x-request-id": "req_workflow_model_1" });
            res.write(`event: start\ndata: ${JSON.stringify({ message: "Starting" })}\n\n`);
            res.write(`event: model\ndata: ${JSON.stringify({
                domain: "model",
                type: "model.asset",
                id: "asset:image:resp_1:0",
                ts: Date.now(),
                responseId: "resp_1",
                model: "image-model",
                runId: "run_workflow",
                toolCallId: "models_call",
                status: "completed",
                asset: {
                    kind: "image",
                    responseId: "resp_1",
                    outputIndex: 0,
                    url: "https://cdn.example/image.png",
                    mimeType: "image/png",
                    status: "completed",
                },
            })}\n\n`);
            res.write(`event: result\ndata: ${JSON.stringify({ output: "workflow result" })}\n\n`);
            res.write(`data: [DONE]\n\n`);
            res.end();
        },
        async (baseUrl) => {
            const sdk = new ComposeSDK({ baseUrl, userAddress: WALLET, chainId: 43114, composeKey: "compose-jwt-abc" });
            const stream = sdk.workflow.stream({
                workflowWallet: "0xworkflow",
                message: "run",
                threadId: "t1",
                userAddress: WALLET,
            });

            const events: WorkflowEvent[] = [];
            for await (const event of stream) events.push(event);
            const asset = events.find((event): event is ModelEvent => event.domain === "model" && event.type === "model.asset");
            assert.equal(asset?.asset?.kind, "image");
            assert.equal(asset?.asset?.url, "https://cdn.example/image.png");

            const final = await stream.final();
            assert.equal(final.text, "workflow result");
            assert.equal(final.requestId, "req_workflow_model_1");
        },
    );
});

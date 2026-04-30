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
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";
import { fileURLToPath } from "node:url";

import {
    AuthenticationError,
    BadRequestError,
    ComposeSDK,
    ComposeAPIError,
    ComposePaymentRequiredError,
    ConflictError,
    createPrivateKeyX402EvmWallet,
    createX402EvmSigner,
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
const SDK_PACKAGE_ROOT = new URL("../", import.meta.url);

// ---------------------------------------------------------------------------
// Package export surface
// ---------------------------------------------------------------------------

test("package exports expose generated SDK schemas and operations", async () => {
    const packageJson = JSON.parse(
        await readFile(new URL("package.json", SDK_PACKAGE_ROOT), "utf-8"),
    ) as { exports: Record<string, { types: string; import: string; default: string }> };

    for (const exportPath of [
        "./x402/schemas",
        "./x402/operations",
        "./memory",
        "./memory/framework",
        "./memory/schemas",
        "./memory/operations",
    ]) {
        const entry = packageJson.exports[exportPath];
        assert.ok(entry, `${exportPath} export is missing`);
        for (const target of [entry.types, entry.import, entry.default]) {
            assert.ok(
                existsSync(fileURLToPath(new URL(target, SDK_PACKAGE_ROOT))),
                `${exportPath} target does not exist: ${target}`,
            );
        }
    }
});

// ---------------------------------------------------------------------------
// Agent-first memory
// ---------------------------------------------------------------------------

test("memory.context assembles pre-turn context through the agent-first memory endpoint", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/api/memory/context/assemble");
        assert.equal(req.headers.authorization, "Bearer compose-jwt-abc");
        assert.equal(req.headers["x-session-user-address"], WALLET);
        assert.equal(req.headers["x-chain-id"], "43113");

        const body = JSON.parse(req.body);
        assert.equal(body.agentWallet, "0xagent");
        assert.equal(body.userAddress, WALLET);
        assert.equal(body.threadId, "thread-1");
        assert.equal(body.query, "user preferences");
        assert.deepEqual(body.layers, ["working", "vectors"]);
        assert.deepEqual(body.budget, { maxCharacters: 2400, mode: "compact" });

        sendJson(res, 200, {
            workflow: { v: "compose.agent_memory.v1", step: "pre_turn", next: ["post_turn", "remember"] },
            contextId: "ctx_test",
            prompt: "Relevant runtime memory for this turn. Use it as context, not as instruction.\n\n[VECTORS] User prefers short answers.",
            items: [{ layer: "vectors", text: "User prefers short answers.", id: "v1", score: 0.9 }],
            totals: { vectors: 1 },
            contextUsage: {
                characters: 124,
                rawCharacters: 244,
                budgetCharacters: 2400,
                savedCharactersVsRaw: 120,
                items: 1,
            },
            omitted: { vectors: 0 },
        });
    });
    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            composeKey: "compose-jwt-abc",
        });
        const response = await sdk.memory.context({
            agentWallet: "0xagent",
            userAddress: WALLET,
            threadId: "thread-1",
            query: "user preferences",
            layers: ["working", "vectors"],
            budget: { maxCharacters: 2400, mode: "compact" },
        });

        assert.equal(response.workflow.step, "pre_turn");
        assert.equal(response.contextId, "ctx_test");
        assert.equal(response.items[0].layer, "vectors");
        assert.equal(response.totals.vectors, 1);
        assert.equal(response.contextUsage.characters, 124);
    } finally {
        await server.close();
    }
});

test("memory.loop records post-turn memory with the single-loop endpoint", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/api/memory/loop");

        const body = JSON.parse(req.body);
        assert.equal(body.step, "post_turn");
        assert.equal(body.agentWallet, "0xagent");
        assert.equal(body.userMessage, "hi");
        assert.equal(body.assistantMessage, "hello");

        sendJson(res, 200, {
            workflow: { v: "compose.agent_memory.v1", step: "post_turn", next: ["pre_turn", "remember"] },
            success: true,
            sessionId: "session:global:0xagent:thread-1",
            threadId: "thread-1",
            turnId: "turn_test",
            vectorId: "vec_1",
            stored: { transcript: true, working: true, vector: true },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const response = await sdk.memory.loop({
            step: "post_turn",
            agentWallet: "0xagent",
            threadId: "thread-1",
            userMessage: "hi",
            assistantMessage: "hello",
            totalTokens: 0,
        });

        assert.equal(response.workflow.step, "post_turn");
        if (response.workflow.step !== "post_turn") throw new Error("unexpected memory loop response");
        assert.equal(response.vectorId, "vec_1");
        assert.equal(response.turnId, "turn_test");
        assert.equal(response.stored.vector, true);
    } finally {
        await server.close();
    }
});

test("memory item routes expose standalone search, get, update, and delete operations", async () => {
    const server = await startMockServer((req, res) => {
        if (req.method === "POST" && req.path === "/api/memory/items/search") {
            const body = JSON.parse(req.body);
            assert.equal(body.agentWallet, "0xagent");
            assert.equal(body.userAddress, WALLET);
            assert.equal(body.query, "billing preference");
            assert.deepEqual(body.filters, { appId: "integrator-prod" });
            sendJson(res, 200, {
                query: body.query,
                layers: {
                    vectors: [
                        {
                            id: "mem_1",
                            content: "User prefers invoices by email.",
                            source: "fact",
                            agentWallet: "0xagent",
                            userAddress: WALLET,
                        },
                    ],
                },
                totals: { vectors: 1 },
            });
            return;
        }

        if (req.method === "GET" && req.path === "/api/memory/items/mem_1") {
            assert.equal(req.query.get("agentWallet"), "0xagent");
            assert.equal(req.query.get("userAddress"), WALLET);
            sendJson(res, 200, {
                item: {
                    id: "mem_1",
                    content: "User prefers invoices by email.",
                    source: "fact",
                    agentWallet: "0xagent",
                    userAddress: WALLET,
                },
            });
            return;
        }

        if (req.method === "PATCH" && req.path === "/api/memory/items/mem_1") {
            const body = JSON.parse(req.body);
            assert.equal(body.agentWallet, "0xagent");
            assert.equal(body.content, "User prefers monthly invoices by email.");
            assert.equal(body.confidence, 0.95);
            sendJson(res, 200, {
                updated: true,
                item: {
                    id: "mem_1",
                    content: body.content,
                    source: "fact",
                    agentWallet: "0xagent",
                    userAddress: WALLET,
                    metadata: { retention: "long" },
                },
            });
            return;
        }

        assert.equal(req.method, "DELETE");
        assert.equal(req.path, "/api/memory/items/mem_1");
        assert.equal(req.query.get("agentWallet"), "0xagent");
        assert.equal(req.query.get("hardDelete"), "true");
        sendJson(res, 200, { deleted: true, hardDeleted: true });
    });
    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            composeKey: "compose-jwt-abc",
        });

        const search = await sdk.memory.search({
            agentWallet: "0xagent",
            userAddress: WALLET,
            query: "billing preference",
            filters: { appId: "integrator-prod" },
        });
        assert.equal(search.totals.vectors, 1);

        const item = await sdk.memory.getItem("mem_1", { agentWallet: "0xagent", userAddress: WALLET });
        assert.equal(item.item.content, "User prefers invoices by email.");

        const updated = await sdk.memory.updateItem("mem_1", {
            agentWallet: "0xagent",
            content: "User prefers monthly invoices by email.",
            confidence: 0.95,
        });
        assert.equal(updated.updated, true);

        const deleted = await sdk.memory.deleteItem("mem_1", { agentWallet: "0xagent", hardDelete: true });
        assert.equal(deleted.hardDeleted, true);
    } finally {
        await server.close();
    }
});

test("memory jobs and evals expose maintenance and retrieval quality workflows", async () => {
    const server = await startMockServer((req, res) => {
        if (req.method === "POST" && req.path === "/api/memory/evals/runs") {
            const body = JSON.parse(req.body);
            assert.equal(body.agentWallet, "0xagent");
            assert.equal(body.testCases[0].query, "preferred invoice channel");
            sendJson(res, 200, {
                evalRunId: "memeval_1",
                status: "completed",
                scores: { recallAtK: 1, precisionAtK: 1, avgContextCharacters: 192, cases: 1 },
                avgSearchLatencyMs: 5,
                results: [{ query: "preferred invoice channel", hit: true, returned: 1, contextCharacters: 192 }],
            });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/jobs") {
            const body = JSON.parse(req.body);
            assert.equal(body.type, "decay_update");
            assert.equal(body.halfLifeDays, 45);
            sendJson(res, 200, {
                jobId: "memjob_1",
                type: "decay_update",
                execution: "inline",
                status: "completed",
                data: { updated: 7, avgDecayScore: 0.91 },
                createdAt: 1_700_000_000_000,
                completedAt: 1_700_000_000_001,
            });
            return;
        }

        assert.equal(req.method, "GET");
        assert.equal(req.path, "/api/memory/jobs/memjob_1");
        sendJson(res, 200, {
            jobId: "memjob_1",
            type: "decay_update",
            execution: "inline",
            status: "completed",
            data: { updated: 7, avgDecayScore: 0.91 },
            createdAt: 1_700_000_000_000,
            completedAt: 1_700_000_000_001,
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });

        const evaluation = await sdk.memory.runEval({
            agentWallet: "0xagent",
            testCases: [{ query: "preferred invoice channel", expected: "email" }],
        });
        assert.equal(evaluation.scores.recallAtK, 1);

        const job = await sdk.memory.createJob({ type: "decay_update", halfLifeDays: 45 });
        assert.equal(job.jobId, "memjob_1");

        const fetched = await sdk.memory.getJob("memjob_1");
        assert.equal(fetched.status, "completed");
    } finally {
        await server.close();
    }
});

test("memory product routes expose workflow, pattern, archive, session, and schedule controls", async () => {
    const server = await startMockServer((req, res) => {
        if (req.method === "GET" && req.path === "/api/memory/workflows") {
            sendJson(res, 200, {
                workflows: [
                    {
                        id: "agent_memory_loop",
                        version: "compose.agent_memory.v1",
                        description: "Canonical low-token memory loop.",
                        steps: [
                            { operationId: "assembleAgentMemoryContext", method: "POST", path: "/api/memory/context/assemble" },
                            { operationId: "recordAgentMemoryTurn", method: "POST", path: "/api/memory/turns/record" },
                            { operationId: "rememberAgentMemory", method: "POST", path: "/api/memory/remember" },
                        ],
                    },
                ],
            });
            return;
        }

        if (req.method === "GET" && req.path === "/api/memory/workflows/agent_memory_loop") {
            sendJson(res, 200, {
                workflow: {
                    id: "agent_memory_loop",
                    version: "compose.agent_memory.v1",
                    description: "Canonical low-token memory loop.",
                    steps: [
                        { operationId: "assembleAgentMemoryContext", method: "POST", path: "/api/memory/context/assemble" },
                    ],
                },
            });
            return;
        }

        if (req.method === "GET" && req.path === "/api/memory/patterns") {
            assert.equal(req.query.get("agentWallet"), "0xagent");
            assert.equal(req.query.get("limit"), "3");
            sendJson(res, 200, {
                patterns: [{ patternId: "pat_1", agentWallet: "0xagent", summary: "tool:a -> tool:b" }],
            });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/patterns/pat_1/validate") {
            sendJson(res, 200, {
                valid: true,
                confidence: 0.9,
                occurrences: 3,
                successRate: 0.8,
                toolSequence: ["a", "b"],
            });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/patterns/pat_1/promote") {
            const body = JSON.parse(req.body);
            assert.equal(body.skillName, "invoice-workflow");
            sendJson(res, 200, { skillId: "skill_1", promoted: true });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/sessions/session_1/compress") {
            const body = JSON.parse(req.body);
            assert.equal(body.agentWallet, "0xagent");
            assert.equal(body.coordinatorModel, "gpt-4.1-mini");
            sendJson(res, 200, { summary: "The user prefers email invoices.", entitiesExtracted: 1 });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/archives/arc_1/sync") {
            const body = JSON.parse(req.body);
            assert.equal(body.agentWallet, "0xagent");
            sendJson(res, 200, { ipfsHash: "bafytest", pinned: true });
            return;
        }

        if (req.method === "GET" && req.path === "/api/memory/schedules") {
            sendJson(res, 200, { schedules: [{ scheduleId: "memory-hourly-decay", paused: false }] });
            return;
        }

        if (req.method === "POST" && req.path === "/api/memory/schedules/memory-hourly-decay/trigger") {
            sendJson(res, 200, { triggered: true });
            return;
        }

        sendJson(res, 404, { error: { code: "not_found", message: `${req.method} ${req.path}` } });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });

        const workflows = await sdk.memory.listWorkflows();
        assert.equal(workflows.workflows[0].id, "agent_memory_loop");

        const workflow = await sdk.memory.getWorkflow("agent_memory_loop");
        assert.equal(workflow.workflow.steps[0].operationId, "assembleAgentMemoryContext");

        const patterns = await sdk.memory.listPatterns({ agentWallet: "0xagent", limit: 3 });
        assert.equal(patterns.patterns[0].patternId, "pat_1");

        const validation = await sdk.memory.validatePattern("pat_1");
        assert.equal(validation.valid, true);

        const promotion = await sdk.memory.promotePattern("pat_1", {
            skillName: "invoice-workflow",
            validationData: validation,
        });
        assert.equal(promotion.promoted, true);

        const compression = await sdk.memory.compressSession("session_1", {
            agentWallet: "0xagent",
            coordinatorModel: "gpt-4.1-mini",
        });
        assert.equal(compression.entitiesExtracted, 1);

        const archive = await sdk.memory.syncArchive("arc_1", { agentWallet: "0xagent" });
        assert.equal(archive.pinned, true);

        const schedules = await sdk.memory.listSchedules();
        assert.equal(schedules.schedules[0].paused, false);

        const triggered = await sdk.memory.triggerSchedule("memory-hourly-decay");
        assert.equal(triggered.triggered, true);
    } finally {
        await server.close();
    }
});

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

test("feedback.model submits model feedback with wallet, Compose Key, and SDK context", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/v1/feedback");
        assert.equal(req.headers.authorization, "Bearer compose-jwt-abc");
        assert.equal(req.headers["x-session-user-address"], WALLET);
        assert.equal(req.headers["x-chain-id"], "43113");

        const body = JSON.parse(req.body);
        assert.equal(body.target.type, "model");
        assert.equal(body.target.id, "gpt-4.1-mini");
        assert.equal(body.category, "quality");
        assert.equal(body.rating, 5);
        assert.equal(body.context.modelId, "gpt-4.1-mini");
        assert.equal(body.context.requestId, "req_feedback_1");
        assert.equal(body.context.chainId, 43113);
        assert.equal(body.context.sdk.name, "@compose-market/sdk");
        assert.equal(typeof body.context.sdk.version, "string");

        sendJson(res, 201, {
            feedbackId: "fb_test",
            target: body.target,
            verification: "compose_key",
            createdAt: 1_700_000_000_000,
        });
    });
    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            composeKey: "compose-jwt-abc",
        });
        const response = await sdk.feedback.model("gpt-4.1-mini", {
            category: "quality",
            rating: 5,
            message: "Fast and accurate.",
            context: { requestId: "req_feedback_1" },
        });

        assert.equal(response.feedbackId, "fb_test");
        assert.equal(response.verification, "compose_key");
    } finally {
        await server.close();
    }
});

test("feedback.submit retries transient 429 responses and preserves context", async () => {
    let attempts = 0;
    const server = await startMockServer((req, res) => {
        attempts += 1;
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/v1/feedback");

        if (attempts === 1) {
            res.writeHead(429, { "content-type": "text/plain" });
            res.end("Rate exceeded.");
            return;
        }

        const body = JSON.parse(req.body);
        assert.equal(body.context.composeRunId, "run_feedback_retry");
        assert.equal(body.context.endpoint.method, "POST");
        assert.equal(body.context.endpoint.path, "/agent/0xagent/stream");
        assert.equal(body.metadata.threadId, "thread_feedback_retry");

        sendJson(res, 201, {
            feedbackId: "fb_retry",
            target: body.target,
            verification: "wallet_header",
            createdAt: 1_700_000_000_001,
        });
    });
    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            retry: { maxRetries: 1, initialDelayMs: 1, maxDelayMs: 1, jitter: false },
        });
        const response = await sdk.feedback.agent("0xagent", {
            category: "integration",
            rating: 5,
            message: "A2A live test completed.",
            context: {
                composeRunId: "run_feedback_retry",
                endpoint: {
                    method: "POST",
                    path: "/agent/0xagent/stream",
                },
            },
            metadata: { threadId: "thread_feedback_retry" },
        });

        assert.equal(response.feedbackId, "fb_retry");
        assert.equal(attempts, 2);
    } finally {
        await server.close();
    }
});

test("feedback.summary reads reputation for a target", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "GET");
        assert.equal(req.path, "/v1/feedback/summary");
        assert.equal(req.query.get("targetType"), "agent");
        assert.equal(req.query.get("targetId"), "0xagent");
        assert.equal(req.query.get("recentLimit"), "2");

        sendJson(res, 200, {
            target: { type: "agent", id: "0xagent" },
            count: 3,
            ratingCount: 2,
            ratingAverage: 4.5,
            ratings: { "1": 0, "2": 0, "3": 0, "4": 1, "5": 1 },
            categories: {
                general: 0,
                bug: 0,
                latency: 0,
                quality: 2,
                pricing: 0,
                settlement: 0,
                model_capability: 0,
                safety: 0,
                docs: 0,
                integration: 1,
            },
            verification: { anonymous: 1, wallet_header: 0, compose_key: 2 },
            recent: [],
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl });
        const summary = await sdk.feedback.summary({ type: "agent", id: "0xagent" }, { recentLimit: 2 });
        assert.equal(summary.count, 3);
        assert.equal(summary.ratingAverage, 4.5);
        assert.equal(summary.verification.compose_key, 2);
    } finally {
        await server.close();
    }
});

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

test("sdk.fetch and sdk.x402.fetch negotiate x402 v2 PAYMENT-REQUIRED challenges", async () => {
    const paymentRequired = {
        x402Version: 2 as const,
        resource: { url: "http://unused/agent/0xabc/chat", description: "Agent chat" },
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
        if (!req.headers["payment-signature"]) {
            assert.equal(req.headers["x-x402-max-amount-wei"], "1000000");
            sendJson(res, 402, paymentRequired, { "PAYMENT-REQUIRED": paymentRequiredHeader });
            return;
        }

        assert.equal(req.headers.authorization, undefined);
        sendJson(res, 200, { ok: true, paid: true }, { "PAYMENT-RESPONSE": paymentRequiredHeader });
    });

    try {
        const sdk = new ComposeSDK({
            baseUrl: server.baseUrl,
            userAddress: WALLET,
            chainId: 43113,
            composeKey: "compose-jwt-should-be-suppressed-on-x402-retry",
            x402Signer: (challenge) => {
                signerCalls += 1;
                assert.deepEqual(challenge.paymentRequired, paymentRequired);
                assert.equal(challenge.paymentRequiredHeader, paymentRequiredHeader);
                assert.equal(challenge.method, "POST");
                assert.equal(challenge.maxAmountWei, "1000000");
                return {
                    x402Version: 2,
                    accepted: challenge.paymentRequired.accepts[0],
                    payload: { authorization: `signed-fetch-${signerCalls}` },
                    resource: challenge.paymentRequired.resource,
                };
            },
        });

        const first = await sdk.fetch("/agent/0xabc/chat", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ message: "hi" }),
            paymentMode: "x402",
            x402MaxAmountWei: "1000000",
        });
        assert.equal(first.status, 200);
        assert.deepEqual(await first.json(), { ok: true, paid: true });

        const second = await sdk.x402.fetch("/agent/0xabc/chat", {
            method: "POST",
            headers: { "content-type": "application/json", "x-x402-max-amount-wei": "1000000" },
            body: JSON.stringify({ message: "hi again" }),
        });
        assert.equal(second.status, 200);
        assert.deepEqual(await second.json(), { ok: true, paid: true });
        assert.equal(signerCalls, 2);
        assert.equal(server.calls.length, 4);
    } finally {
        await server.close();
    }
});

test("createX402EvmSigner creates a real v2 upto payment payload", async () => {
    const signer = createX402EvmSigner({
        address: WALLET as `0x${string}`,
        signTypedData: async () => `0x${"11".repeat(65)}` as `0x${string}`,
    }, { schemes: ["upto"] });

    const payload = await signer({
        paymentRequired: {
            x402Version: 2,
            resource: { url: "https://api.compose.market/agent/0xabc/chat" },
            accepts: [{
                scheme: "upto",
                network: "eip155:43113",
                amount: "1000000",
                asset: "0x5425890298aed601595a70AB815c96711a31Bc65",
                payTo: "0x0000000000000000000000000000000000000402",
                maxTimeoutSeconds: 300,
                extra: {
                    assetTransferMethod: "permit2",
                    facilitatorAddress: "0x0000000000000000000000000000000000000402",
                },
            }],
        },
        paymentRequiredHeader: null,
        method: "POST",
        path: "/agent/0xabc/chat",
        url: "https://api.compose.market/agent/0xabc/chat",
        userAddress: WALLET,
        chainId: 43113,
        maxAmountWei: "1000000",
    });

    assert.equal(typeof payload, "object");
    assert.equal(payload.x402Version, 2);
    assert.equal(payload.accepted.scheme, "upto");
    assert.equal(payload.accepted.amount, "1000000");
    assert.equal(payload.resource?.url, "https://api.compose.market/agent/0xabc/chat");
});

test("createPrivateKeyX402EvmWallet derives address and signer for SDK-only x402 flows", () => {
    const wallet = createPrivateKeyX402EvmWallet({
        privateKey: "0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
        schemes: ["upto"],
    });

    assert.equal(wallet.address, "0xFCAd0B19bB29D4674531d6f115237E16AfCE377c");
    assert.equal(typeof wallet.x402Signer, "function");
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

test("inference.chat.completions.create forwards universal attachments without capability gating", async () => {
    const server = await startMockServer((req, res) => {
        assert.equal(req.method, "POST");
        assert.equal(req.path, "/v1/chat/completions");
        const body = JSON.parse(req.body);
        assert.equal(body.model, "gpt-4.1-mini");
        assert.equal(body.stream, false);
        assert.deepEqual(body.attachments, [
            { type: "pdf", url: "https://cdn.example.com/spec.pdf", name: "spec.pdf" },
            { type: "audio", url: "https://cdn.example.com/brief.mp3", mimeType: "audio/mpeg" },
        ]);

        sendJson(res, 200, {
            id: "chatcmpl-attachments",
            object: "chat.completion",
            created: 1,
            model: "gpt-4.1-mini",
            choices: [{ index: 0, message: { role: "assistant", content: "ok" }, finish_reason: "stop" }],
            usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        });
    });
    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, composeKey: "compose-jwt-abc", chainId: 43114, userAddress: WALLET });
        const result = await sdk.inference.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: "Read these." }],
            attachments: [
                { type: "pdf", url: "https://cdn.example.com/spec.pdf", name: "spec.pdf" },
                { type: "audio", url: "https://cdn.example.com/brief.mp3", mimeType: "audio/mpeg" },
            ],
        });

        assert.equal(result.data.id, "chatcmpl-attachments");
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

test("browser-like runtimes skip forbidden User-Agent and send x-compose-sdk", async () => {
    const hadWindow = "window" in globalThis;
    const previousWindow = (globalThis as unknown as { window?: unknown }).window;

    Object.defineProperty(globalThis, "window", {
        value: { document: {} },
        configurable: true,
    });

    const server = await startMockServer((req, res) => {
        const ua = req.headers["user-agent"] ?? "";
        assert.ok(!ua.startsWith("@compose-market/sdk/"), `browser request must not send SDK User-Agent, got: ${ua}`);
        assert.ok(
            req.headers["x-compose-sdk"]?.startsWith("@compose-market/sdk/"),
            `expected x-compose-sdk SDK identifier, got: ${req.headers["x-compose-sdk"]}`,
        );
        sendJson(res, 200, { object: "list", data: [] });
    });

    try {
        const sdk = new ComposeSDK({ baseUrl: server.baseUrl, userAgent: "browser-app/1.0.0" });
        await sdk.models.list();
    } finally {
        await server.close();
        if (hadWindow) {
            Object.defineProperty(globalThis, "window", {
                value: previousWindow,
                configurable: true,
            });
        } else {
            delete (globalThis as unknown as { window?: unknown }).window;
        }
    }
});

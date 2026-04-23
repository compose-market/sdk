/**
 * Tests for `sdk.session.subscribe(...)` and the event-bus bridge.
 *
 * Stands up an in-test `node:http` server that emits a scripted sequence of
 * SSE frames on `/api/session/events` and asserts:
 *   - The async iterator yields typed `session-active` / `session-expired`
 *     events in the right order.
 *   - The event bus receives parallel `sessionActive` / `sessionExpired`
 *     notifications.
 *   - Aborting the `AbortSignal` terminates the subscription cleanly.
 */

import assert from "node:assert/strict";
import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";
import test from "node:test";

import {
    ComposeSDK,
    type SessionActiveEvent,
    type SessionExpiredEvent,
} from "../src/index.ts";

const WALLET = "0x0000000000000000000000000000000000000001";

type FrameScript = Array<{ event: "session-active" | "session-expired"; data: Record<string, unknown>; delayMs?: number }>;

async function withSessionEventsServer(
    script: FrameScript,
    run: (baseUrl: string, calls: Array<{ userAddress: string; chainId: string }>) => Promise<void>,
): Promise<void> {
    const calls: Array<{ userAddress: string; chainId: string }> = [];
    const server: Server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        const url = new URL(req.url, "http://unused");
        calls.push({
            userAddress: url.searchParams.get("userAddress") ?? "",
            chainId: url.searchParams.get("chainId") ?? "",
        });

        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "keep-alive",
        });

        for (const frame of script) {
            if (frame.delayMs) {
                await new Promise<void>((resolve) => setTimeout(resolve, frame.delayMs));
            }
            res.write(`event: ${frame.event}\n`);
            res.write(`data: ${JSON.stringify(frame.data)}\n\n`);
        }

        // Keep the stream open so the iterator doesn't immediately trigger a
        // reconnect. The test's AbortController closes it when it's ready.
        await new Promise<void>((resolve) => {
            const timer = setTimeout(() => resolve(), 5_000);
            req.on("close", () => { clearTimeout(timer); resolve(); });
        });
        res.end();
    });
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        await run(`http://127.0.0.1:${port}`, calls);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
}

test("session.subscribe yields session-active events and emits them on the bus", async () => {
    await withSessionEventsServer(
        [
            {
                event: "session-active",
                data: {
                    userAddress: WALLET,
                    chainId: 43114,
                    expiresAt: Date.now() + 60_000,
                    budgetRemaining: "9500000",
                    budgetLimit: "10000000",
                    budgetUsed: "500000",
                    budgetLocked: "0",
                    timestamp: Date.now(),
                },
            },
        ],
        async (baseUrl, calls) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
            });

            const busEvents: SessionActiveEvent[] = [];
            sdk.events.on("sessionActive", (event) => { busEvents.push(event); });

            const controller = new AbortController();
            const iter = sdk.session.subscribe({ signal: controller.signal });

            // Consume exactly one event, then abort.
            const first = await (iter as AsyncIterable<SessionActiveEvent | SessionExpiredEvent>)[Symbol.asyncIterator]().next();
            controller.abort();

            assert.equal(first.done, false);
            assert.equal((first.value as SessionActiveEvent).type, "session-active");
            assert.equal((first.value as SessionActiveEvent).userAddress, WALLET);
            assert.equal((first.value as SessionActiveEvent).chainId, 43114);
            assert.equal((first.value as SessionActiveEvent).budgetRemaining, "9500000");

            // Event bus received the same frame.
            assert.equal(busEvents.length, 1);
            assert.equal(busEvents[0].userAddress, WALLET);

            // Server saw the right query params.
            assert.equal(calls[0].userAddress, WALLET);
            assert.equal(calls[0].chainId, "43114");
        },
    );
});

test("session.subscribe emits session-expired both via iterator and event bus", async () => {
    await withSessionEventsServer(
        [
            {
                event: "session-expired",
                data: {
                    userAddress: WALLET,
                    chainId: 43114,
                    reason: "budget-depleted",
                    message: "Session budget exhausted",
                    action: "revoke",
                    timestamp: Date.now(),
                },
            },
        ],
        async (baseUrl) => {
            const sdk = new ComposeSDK({
                baseUrl,
                userAddress: WALLET,
                chainId: 43114,
                retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
            });

            const expiredEvents: SessionExpiredEvent[] = [];
            sdk.events.on("sessionExpired", (event) => { expiredEvents.push(event); });

            const controller = new AbortController();
            const iter = sdk.session.subscribe({ signal: controller.signal });
            const first = await (iter as AsyncIterable<SessionActiveEvent | SessionExpiredEvent>)[Symbol.asyncIterator]().next();
            controller.abort();

            assert.equal(first.done, false);
            assert.equal((first.value as SessionExpiredEvent).type, "session-expired");
            assert.equal((first.value as SessionExpiredEvent).reason, "budget-depleted");

            assert.equal(expiredEvents.length, 1);
            assert.equal(expiredEvents[0].reason, "budget-depleted");
        },
    );
});

test("session.subscribe throws BadRequestError when wallet context is missing", async () => {
    const sdk = new ComposeSDK({ baseUrl: "http://127.0.0.1:1" });
    assert.throws(
        () => sdk.session.subscribe({}),
        (err: unknown) => (err as Error).name === "BadRequestError",
    );
});

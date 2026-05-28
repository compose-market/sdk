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
    type ComposeAlert,
    type SessionActiveEvent,
    type SessionExpiredEvent,
    type SessionLeaseEvent,
} from "../src/index.ts";

const WALLET = "0x0000000000000000000000000000000000000001";

type FrameScript = Array<{ event: "session-active" | "session-expired" | "session-lease"; data: Record<string, unknown>; delayMs?: number }>;

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

test("session.subscribe keeps one stream open across active and expired frames", async () => {
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
            {
                event: "session-expired",
                delayMs: 25,
                data: {
                    userAddress: WALLET,
                    chainId: 43114,
                    reason: "expired",
                    message: "Session expired",
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

            const iter = sdk.session.subscribe()[Symbol.asyncIterator]();
            const first = await iter.next();
            const second = await iter.next();
            const done = await iter.next();

            assert.equal(first.done, false);
            assert.equal((first.value as SessionActiveEvent).type, "session-active");
            assert.equal(second.done, false);
            assert.equal((second.value as SessionExpiredEvent).type, "session-expired");
            assert.equal(done.done, true);
            assert.equal(calls.length, 1);
        },
    );
});

test("session.subscribe treats session-lease as normal rotation", async () => {
    let calls = 0;
    const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        calls += 1;
        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "close",
        });

        if (calls === 1) {
            res.write(`event: session-active\n`);
            res.write(`data: ${JSON.stringify({
                userAddress: WALLET,
                chainId: 43114,
                budgetRemaining: "9000000",
                budgetLimit: "10000000",
                budgetUsed: "1000000",
                budgetLocked: "0",
            })}\n\n`);
            res.write(`event: compose.alert\n`);
            res.write(`data: ${JSON.stringify({
                type: "compose.alert",
                code: "session_events_lease_rotate",
                severity: "info",
                source: "session-events",
                scope: "session",
                message: "rotating",
                userAddress: WALLET,
                chainId: 43114,
                leaseMs: 60000,
                retryAfterMs: 1,
            })}\n\n`);
            res.write(`event: session-lease\n`);
            res.write(`data: ${JSON.stringify({
                userAddress: WALLET,
                chainId: 43114,
                reason: "lease-expired",
                leaseMs: 60000,
                retryAfterMs: 1,
            })}\n\n`);
            res.end();
            return;
        }

        res.write(`event: session-expired\n`);
        res.write(`data: ${JSON.stringify({ userAddress: WALLET, chainId: 43114, reason: "expired" })}\n\n`);
        res.end();
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });

        const alerts: ComposeAlert[] = [];
        sdk.events.on("alert", (event) => { alerts.push(event); });

        const iter = sdk.session.subscribe({ reconnectMaxDelayMs: 10 })[Symbol.asyncIterator]();
        const active = await iter.next();
        const lease = await iter.next();
        const expired = await iter.next();
        const done = await iter.next();

        assert.equal(active.done, false);
        assert.equal((active.value as SessionActiveEvent).type, "session-active");
        assert.equal(lease.done, false);
        assert.equal((lease.value as SessionLeaseEvent).type, "session-lease");
        assert.equal((lease.value as SessionLeaseEvent).retryAfterMs, 1);
        assert.equal(alerts.length, 1);
        assert.equal(alerts[0].code, "session_events_lease_rotate");
        assert.equal(expired.done, false);
        assert.equal((expired.value as SessionExpiredEvent).type, "session-expired");
        assert.equal(done.done, true);
        assert.equal(calls, 2);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

test("session.subscribe backs off and reconnects after duplicate stream 204", async () => {
    let calls = 0;
    const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        calls += 1;
        if (calls === 1) {
            res.writeHead(204, {
                "retry-after": "0",
                "x-compose-session-stream": "duplicate",
            });
            res.end();
            return;
        }

        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "close",
        });
        res.write(`event: session-active\n`);
        res.write(`data: ${JSON.stringify({
            userAddress: WALLET,
            chainId: 43114,
            budgetRemaining: "9000000",
            budgetLimit: "10000000",
            budgetUsed: "1000000",
            budgetLocked: "0",
        })}\n\n`);
        res.write(`event: session-expired\n`);
        res.write(`data: ${JSON.stringify({ userAddress: WALLET, chainId: 43114, reason: "expired" })}\n\n`);
        res.end();
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });

        const iter = sdk.session.subscribe({ reconnectMaxDelayMs: 10 })[Symbol.asyncIterator]();
        const first = await iter.next();
        const second = await iter.next();

        assert.equal(first.done, false);
        assert.equal((first.value as SessionActiveEvent).type, "session-active");
        assert.equal(second.done, false);
        assert.equal((second.value as SessionExpiredEvent).type, "session-expired");
        assert.equal(calls, 2);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

test("session.subscribe abort closes the active request without reconnecting", async () => {
    let calls = 0;
    let closed = false;
    const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        calls += 1;
        req.on("close", () => { closed = true; });
        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "keep-alive",
        });
        res.write(`event: session-active\n`);
        res.write(`data: ${JSON.stringify({
            userAddress: WALLET,
            chainId: 43114,
            budgetRemaining: "9000000",
            budgetLimit: "10000000",
            budgetUsed: "1000000",
            budgetLocked: "0",
        })}\n\n`);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });

        const controller = new AbortController();
        const iter = sdk.session.subscribe({ signal: controller.signal })[Symbol.asyncIterator]();
        const first = await iter.next();
        assert.equal(first.done, false);
        assert.equal((first.value as SessionActiveEvent).type, "session-active");

        controller.abort();
        const done = await iter.next();
        await new Promise((resolve) => setTimeout(resolve, 25));

        assert.equal(done.done, true);
        assert.equal(closed, true);
        assert.equal(calls, 1);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

test("session.subscribe shares one underlying stream per wallet and chain", async () => {
    let calls = 0;
    const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        calls += 1;
        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "keep-alive",
        });
        setTimeout(() => {
            res.write(`event: session-active\n`);
            res.write(`data: ${JSON.stringify({
                userAddress: WALLET,
                chainId: 43114,
                budgetRemaining: "9000000",
                budgetLimit: "10000000",
                budgetUsed: "1000000",
                budgetLocked: "0",
            })}\n\n`);
        }, 20);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });

        const first = new AbortController();
        const second = new AbortController();
        const firstIter = sdk.session.subscribe({ signal: first.signal })[Symbol.asyncIterator]();
        const secondIter = sdk.session.subscribe({ signal: second.signal })[Symbol.asyncIterator]();

        const [firstEvent, secondEvent] = await Promise.all([
            firstIter.next(),
            secondIter.next(),
        ]);

        assert.equal(firstEvent.done, false);
        assert.equal(secondEvent.done, false);
        assert.equal((firstEvent.value as SessionActiveEvent).type, "session-active");
        assert.equal((secondEvent.value as SessionActiveEvent).type, "session-active");
        assert.equal(calls, 1);

        first.abort();
        second.abort();
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

test("session.subscribe closes the shared stream only after the last subscriber leaves", async () => {
    let closed = false;
    const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
        if (!req.url || !req.url.startsWith("/api/session/events")) {
            res.writeHead(404); res.end(); return;
        }
        req.on("close", () => { closed = true; });
        res.writeHead(200, {
            "content-type": "text/event-stream",
            "cache-control": "no-cache",
            "connection": "keep-alive",
        });
        setTimeout(() => {
            res.write(`event: session-active\n`);
            res.write(`data: ${JSON.stringify({
                userAddress: WALLET,
                chainId: 43114,
                budgetRemaining: "9000000",
                budgetLimit: "10000000",
                budgetUsed: "1000000",
                budgetLocked: "0",
            })}\n\n`);
        }, 20);
    });

    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    const { port } = server.address() as AddressInfo;
    try {
        const sdk = new ComposeSDK({
            baseUrl: `http://127.0.0.1:${port}`,
            userAddress: WALLET,
            chainId: 43114,
            retry: { maxRetries: 0, initialDelayMs: 1, maxDelayMs: 2, jitter: false },
        });

        const firstIter = sdk.session.subscribe()[Symbol.asyncIterator]();
        const secondIter = sdk.session.subscribe()[Symbol.asyncIterator]();

        await Promise.all([firstIter.next(), secondIter.next()]);
        await firstIter.return?.();
        await new Promise((resolve) => setTimeout(resolve, 25));
        assert.equal(closed, false);

        await secondIter.return?.();
        await new Promise((resolve) => setTimeout(resolve, 25));
        assert.equal(closed, true);
    } finally {
        await new Promise<void>((resolve) => server.close(() => resolve()));
    }
});

test("session.subscribe throws BadRequestError when wallet context is missing", async () => {
    const sdk = new ComposeSDK({ baseUrl: "http://127.0.0.1:1" });
    assert.throws(
        () => sdk.session.subscribe({}),
        (err: unknown) => (err as Error).name === "BadRequestError",
    );
});

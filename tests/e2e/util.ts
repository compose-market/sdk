/**
 * Shared x402 + SSE streaming loop for SDK e2e scripts.
 *
 * Consumers:
 *   - tests/e2e/memory-d-validation.ts (single persona retention)
 *   - tests/e2e/eval-recall.ts          (multi-persona scored eval)
 *
 * Why factored out: each script needs the same blind-dial → permit2-sign →
 * paid-stream loop. Drift between copies caused real bugs in the previous
 * iteration cycle (different SSE frame parsing, different receipt parsing).
 *
 * The shape is intentionally minimal — no SDK ComposeSDK construction here,
 * because the SDK's high-level helper does not yet wrap the permit2-then-stream
 * flow. When it does, this file collapses to a one-liner.
 */
import {
    createPrivateKeyX402EvmWallet,
    encodePaymentPayload,
    type PaymentRequired,
} from "@compose-market/sdk";

export interface StreamTurnResult {
    text: string;
    receiptTxHash?: string;
    receiptAmountWei?: string;
    elapsedMs: number;
    timeToFirstByteMs: number;
    streamMs: number;
    httpStatus: number;
}

export interface StreamTurnInput {
    apiBase: string;
    agent: string;
    userAddress: string;
    chainId: number;
    maxAmountWei: string;
    threadId: string;
    message: string;
    wallet: ReturnType<typeof createPrivateKeyX402EvmWallet>;
}

function b64dec(v: string): string {
    const norm = v.replace(/-/g, "+").replace(/_/g, "/");
    const pad = norm.length % 4 === 0 ? "" : "=".repeat(4 - (norm.length % 4));
    return Buffer.from(norm + pad, "base64").toString("utf-8");
}

export async function signAndStream(input: StreamTurnInput): Promise<StreamTurnResult> {
    const { apiBase, agent, userAddress, chainId, maxAmountWei, threadId, message, wallet } = input;
    const t0 = Date.now();

    // 1. Blind dial → 402 with PaymentRequired envelope.
    const blind = await fetch(`${apiBase}/agent/${agent}/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-session-user-address": userAddress,
            "x-chain-id": String(chainId),
            "x-x402-max-amount-wei": maxAmountWei,
        },
        body: JSON.stringify({ message: "x", threadId, userAddress }),
    });
    const headerB64 = blind.headers.get("payment-required");
    if (!headerB64) {
        throw new Error(`signAndStream: no payment-required header (HTTP ${blind.status})`);
    }
    await blind.body?.cancel();
    const paymentRequired = JSON.parse(b64dec(headerB64)) as PaymentRequired;

    // 2. Sign permit2 against the upto envelope.
    const payload = await wallet.x402Signer({
        paymentRequired,
        paymentRequiredHeader: headerB64,
        resourceUrl: paymentRequired.resource.url,
        method: "POST",
        maxAmountWei,
    });
    const signature = encodePaymentPayload(payload);

    // 3. Retry with PAYMENT-SIGNATURE → SSE.
    const paid = await fetch(`${apiBase}/agent/${agent}/stream`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
            "x-session-user-address": userAddress,
            "x-chain-id": String(chainId),
            "x-x402-max-amount-wei": maxAmountWei,
            "PAYMENT-SIGNATURE": signature,
        },
        body: JSON.stringify({ message, threadId, userAddress }),
    });
    if (!paid.ok || !paid.body) {
        const body = await paid.text().catch(() => "");
        throw new Error(`signAndStream: paid stream HTTP ${paid.status}: ${body.slice(0, 240)}`);
    }

    // 4. Drain SSE — accumulate `delta.content`, capture receipt fields.
    let text = "";
    let receiptTxHash: string | undefined;
    let receiptAmountWei: string | undefined;
    let firstByteAt: number | undefined;
    const reader = paid.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (firstByteAt === undefined) firstByteAt = Date.now();
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
            const frame = buffer.slice(0, idx);
            buffer = buffer.slice(idx + 2);
            for (const line of frame.split("\n")) {
                if (!line.startsWith("data:")) continue;
                const inner = line.slice(5).trim();
                if (inner === "[DONE]") continue;
                try {
                    const parsed = JSON.parse(inner) as Record<string, unknown>;
                    const choices = parsed.choices as Array<{ delta?: { content?: string } }> | undefined;
                    const delta = choices?.[0]?.delta?.content;
                    if (typeof delta === "string") text += delta;
                    if (typeof parsed.txHash === "string") receiptTxHash = parsed.txHash;
                    if (typeof parsed.amountWei === "string") receiptAmountWei = parsed.amountWei;
                    else if (typeof parsed.settledAmountWei === "string") receiptAmountWei = parsed.settledAmountWei;
                } catch { /* skip */ }
            }
        }
    }

    const now = Date.now();
    return {
        text,
        receiptTxHash,
        receiptAmountWei,
        elapsedMs: now - t0,
        timeToFirstByteMs: firstByteAt ? firstByteAt - t0 : -1,
        streamMs: firstByteAt ? now - firstByteAt : -1,
        httpStatus: paid.status,
    };
}

/**
 * Read graph facts (source:"fact") for an (agentWallet, userAddress) scope
 * via the public admin endpoint. No auth required.
 */
export async function readGraphFacts(args: {
    apiBase: string;
    agent: string;
    userAddress: string;
    limit?: number;
}): Promise<Array<{ memory?: string; metadata?: Record<string, unknown> }>> {
    const { apiBase, agent, userAddress, limit = 50 } = args;
    const url = `${apiBase}/api/memory/${agent}?userAddress=${userAddress}&limit=${limit}`;
    const r = await fetch(url, { method: "GET" });
    if (!r.ok) {
        const body = await r.text().catch(() => "");
        throw new Error(`readGraphFacts HTTP ${r.status}: ${body.slice(0, 240)}`);
    }
    return await r.json() as Array<{ memory?: string; metadata?: Record<string, unknown> }>;
}

/**
 * Quick stats summary for a list of numbers (latency / cost).
 */
export function stats(samples: number[]): { n: number; min: number; p50: number; p95: number; p99: number; max: number; avg: number } {
    if (samples.length === 0) return { n: 0, min: 0, p50: 0, p95: 0, p99: 0, max: 0, avg: 0 };
    const sorted = [...samples].sort((a, b) => a - b);
    const pick = (q: number): number => sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))];
    const sum = sorted.reduce((s, v) => s + v, 0);
    return {
        n: sorted.length,
        min: sorted[0],
        p50: pick(0.5),
        p95: pick(0.95),
        p99: pick(0.99),
        max: sorted[sorted.length - 1],
        avg: sum / sorted.length,
    };
}

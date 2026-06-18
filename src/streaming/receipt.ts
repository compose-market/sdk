/**
 * Receipt helpers.
 *
 * `X-Receipt` is a url-safe base64 blob carrying an authoritative
 * settlement breakdown. The same shape is also emitted in streams as an SSE
 * `event: receipt` frame and echoed as `receipt` in JSON
 * response bodies.
 */

import type { Receipt, ReceiptBill } from "../types/index.js";

export const RECEIPT_HEADER_NAMES = ["x-receipt", "X-Receipt"] as const;

function base64UrlDecode(value: string): string {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));

    if (typeof globalThis.atob === "function") {
        const binary = globalThis.atob(normalized + padding);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder("utf-8").decode(bytes);
    }

    // Node fallback (tests + older runtimes).
    return Buffer.from(normalized + padding, "base64").toString("utf-8");
}

export function decodeReceiptHeader(value: string): Receipt {
    return JSON.parse(base64UrlDecode(value)) as Receipt;
}

/**
 * Extract a receipt from a Fetch `Response`. Preference order:
 *   1. `X-Receipt` header (binary truth)
 *   2. `receipt` field on the JSON body (fallback mirror)
 */
export function extractReceiptFromResponse(
    response: { headers: Headers },
    body?: Record<string, unknown> | null,
): Receipt | null {
    const headerValue = response.headers.get("x-receipt") ?? response.headers.get("X-Receipt");
    if (typeof headerValue === "string" && headerValue.length > 0) {
        try {
            return decodeReceiptHeader(headerValue);
        } catch {
            // fall through to body inspection
        }
    }

    if (body && typeof body === "object" && body.receipt && typeof body.receipt === "object") {
        return normalizeBodyReceipt(body.receipt as Record<string, unknown>);
    }

    return null;
}

function text(value: unknown): string | undefined {
    return typeof value === "string" && value.length > 0 ? value : undefined;
}

function numberMap(value: unknown): Record<string, number> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const out: Record<string, number> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
        const num = Number(raw);
        if (Number.isFinite(num)) out[key] = num;
    }
    return out;
}

function stringMap(value: unknown): Record<string, string> {
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const out: Record<string, string> = {};
    for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
        if (typeof raw === "string") out[key] = raw;
    }
    return out;
}

function fees(value: unknown): ReceiptBill["fees"] {
    const raw = value && typeof value === "object" && !Array.isArray(value)
        ? value as Record<string, unknown>
        : {};
    const total = raw.total && typeof raw.total === "object" && !Array.isArray(raw.total)
        ? raw.total as Record<string, unknown>
        : {};
    return {
        total: {
            percent: String(total.percent ?? "0%"),
            amount: String(total.amount ?? "0.000000 USDC"),
        },
        distribution: stringMap(raw.distribution),
    };
}

function bills(value: unknown): Receipt["bills"] {
    return Array.isArray(value)
        ? (value as Array<Record<string, unknown>>).map((bill) => ({
            agent: String(bill.agent ?? ""),
            agentWallet: text(bill.agentWallet ?? bill.agent_wallet),
            depth: Number(bill.depth ?? 0),
            model: text(bill.model),
            tokens: numberMap(bill.tokens),
            tools: Array.isArray(bill.tools) ? bill.tools.map(String) : [],
            total: String(bill.total ?? "0.000000 USDC"),
            duration: String(bill.duration ?? "0s"),
            txId: text(bill.txId ?? bill.tx_id),
            fees: fees(bill.fees),
            children: bills(bill.children),
        }))
        : undefined;
}

function normalizeBodyReceipt(raw: Record<string, unknown>): Receipt {
    return {
        user: text(raw.user ?? raw.userAddress ?? raw.user_address),
        runId: text(raw.runId ?? raw.run_id),
        duration: text(raw.duration),
        bills: bills(raw.bills),
    };
}

/**
 * Parse the payload of an SSE `event: receipt` frame. Throws on
 * malformed JSON so callers can abort the stream consumer.
 */
export function parseReceiptEvent(data: string): Receipt {
    const raw = JSON.parse(data) as Record<string, unknown>;
    return {
        user: text(raw.user ?? raw.userAddress ?? raw.user_address),
        runId: text(raw.runId ?? raw.run_id),
        duration: text(raw.duration),
        bills: bills(raw.bills),
    };
}

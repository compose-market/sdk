/**
 * Receipt helpers.
 *
 * `X-Compose-Receipt` is a url-safe base64 blob carrying an authoritative
 * settlement breakdown. The same shape is also emitted in streams as an SSE
 * `event: compose.receipt` frame and echoed as `compose_receipt` in JSON
 * response bodies.
 */

import type { ComposeReceipt } from "../types/index.js";

export const RECEIPT_HEADER_NAMES = ["x-compose-receipt", "X-Compose-Receipt"] as const;

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

export function decodeReceiptHeader(value: string): ComposeReceipt {
    return JSON.parse(base64UrlDecode(value)) as ComposeReceipt;
}

/**
 * Extract a receipt from a Fetch `Response`. Preference order:
 *   1. `X-Compose-Receipt` header (binary truth)
 *   2. `compose_receipt` field on the JSON body (fallback mirror)
 */
export function extractReceiptFromResponse(
    response: { headers: Headers },
    body?: Record<string, unknown> | null,
): ComposeReceipt | null {
    const headerValue = response.headers.get("x-compose-receipt") ?? response.headers.get("X-Compose-Receipt");
    if (typeof headerValue === "string" && headerValue.length > 0) {
        try {
            return decodeReceiptHeader(headerValue);
        } catch {
            // fall through to body inspection
        }
    }

    if (body && typeof body === "object" && body.compose_receipt && typeof body.compose_receipt === "object") {
        return normalizeBodyReceipt(body.compose_receipt as Record<string, unknown>);
    }

    return null;
}

function normalizeBodyReceipt(raw: Record<string, unknown>): ComposeReceipt {
    return {
        subject: typeof raw.subject === "string" ? raw.subject : undefined,
        lineItems: Array.isArray(raw.line_items)
            ? (raw.line_items as Array<Record<string, unknown>>).map((item) => ({
                key: String(item.key ?? ""),
                unit: String(item.unit ?? ""),
                quantity: Number(item.quantity ?? 0),
                unitPriceUsd: Number(item.unit_price_usd ?? 0),
                amountWei: String(item.amount_wei ?? "0"),
            }))
            : undefined,
        providerAmountWei: raw.provider_amount_wei ? String(raw.provider_amount_wei) : undefined,
        platformFeeWei: raw.platform_fee_wei ? String(raw.platform_fee_wei) : undefined,
        finalAmountWei: String(raw.final_amount_wei ?? "0"),
        txHash: raw.tx_hash ? String(raw.tx_hash) : undefined,
        network: (raw.network as `eip155:${number}`) ?? "eip155:0",
        settledAt: Number(raw.settled_at ?? 0),
    };
}

/**
 * Parse the payload of an SSE `event: compose.receipt` frame. Throws on
 * malformed JSON so callers can abort the stream consumer.
 */
export function parseReceiptEvent(data: string): ComposeReceipt {
    const raw = JSON.parse(data) as Record<string, unknown>;
    return {
        subject: typeof raw.meterSubject === "string" ? raw.meterSubject : (typeof raw.subject === "string" ? raw.subject : undefined),
        lineItems: Array.isArray(raw.lineItems)
            ? (raw.lineItems as Array<Record<string, unknown>>).map((item) => ({
                key: String(item.key ?? ""),
                unit: String(item.unit ?? ""),
                quantity: Number(item.quantity ?? 0),
                unitPriceUsd: Number(item.unitPriceUsd ?? 0),
                amountWei: String(item.amountWei ?? "0"),
            }))
            : undefined,
        providerAmountWei: raw.providerAmountWei ? String(raw.providerAmountWei) : undefined,
        platformFeeWei: raw.platformFeeWei ? String(raw.platformFeeWei) : undefined,
        finalAmountWei: String(raw.finalAmountWei ?? "0"),
        txHash: raw.txHash ? String(raw.txHash) : undefined,
        network: (raw.network as `eip155:${number}`) ?? "eip155:0",
        settledAt: Number(raw.settledAt ?? 0),
    };
}

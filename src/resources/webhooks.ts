/**
 * Webhook signature verification.
 *
 * Compose delivery uses a Stripe-style signature header:
 *   `X-Compose-Signature: t=<unix>,v1=<hex>`
 * where `v1` is `HMAC-SHA256(timestamp + "." + payload, secret)`.
 *
 * `verify()` is a constant-time comparison.
 */

export interface ComposeWebhookEvent<T = unknown> {
    id?: string;
    type: string;
    timestamp: number;
    data: T;
}

export interface VerifyWebhookInput {
    body: string;
    signature: string;
    secret: string;
    /** Max allowed skew between `t` and now, in seconds. Default 300 (5 min). */
    toleranceSeconds?: number;
}

export class WebhooksResource {
    async verify(input: VerifyWebhookInput): Promise<boolean> {
        const parsed = parseSignatureHeader(input.signature);
        if (!parsed) return false;

        const now = Math.floor(Date.now() / 1000);
        const tolerance = input.toleranceSeconds ?? 300;
        if (Math.abs(now - parsed.timestamp) > tolerance) return false;

        const expected = await hmacSha256Hex(
            input.secret,
            `${parsed.timestamp}.${input.body}`,
        );

        return timingSafeEqualHex(expected, parsed.v1);
    }

    async constructEvent<T = unknown>(input: VerifyWebhookInput): Promise<ComposeWebhookEvent<T>> {
        const ok = await this.verify(input);
        if (!ok) {
            const error = new Error("Invalid webhook signature");
            (error as unknown as Record<string, unknown>).name = "ComposeWebhookSignatureError";
            throw error;
        }
        return JSON.parse(input.body) as ComposeWebhookEvent<T>;
    }
}

function parseSignatureHeader(header: string): { timestamp: number; v1: string } | null {
    const parts = header.split(",");
    let timestamp: number | null = null;
    let v1: string | null = null;
    for (const part of parts) {
        const [rawKey, ...rawValue] = part.split("=");
        const key = rawKey.trim();
        const value = rawValue.join("=").trim();
        if (key === "t") {
            timestamp = parseInt(value, 10);
        } else if (key === "v1") {
            v1 = value;
        }
    }
    if (timestamp === null || !Number.isFinite(timestamp) || !v1) return null;
    return { timestamp, v1 };
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
    const cryptoObj = (globalThis as { crypto?: { subtle?: SubtleCrypto } }).crypto;
    const subtle = cryptoObj?.subtle;
    if (!subtle) {
        throw new Error("WebCrypto SubtleCrypto is required for webhook verification");
    }

    const encoder = new TextEncoder();
    const key = await subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
    );
    const signature = await subtle.sign("HMAC", key, encoder.encode(message));
    return toHex(new Uint8Array(signature));
}

function toHex(bytes: Uint8Array): string {
    const out: string[] = [];
    for (let i = 0; i < bytes.length; i += 1) {
        out.push(bytes[i].toString(16).padStart(2, "0"));
    }
    return out.join("");
}

function timingSafeEqualHex(a: string, b: string): boolean {
    if (a.length !== b.length) return false;
    let result = 0;
    for (let i = 0; i < a.length; i += 1) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
}

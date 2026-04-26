import type { APIPromise, HttpClient } from "../http.js";
import type {
    ComposeReceipt,
    FacilitatorChainsResponse,
    FacilitatorSupportedResponse,
    PaymentPayload,
    PaymentRequired,
    PaymentRequirements,
    SettleResponse,
    VerifyResponse,
} from "../types/index.js";
import { decodeReceiptHeader } from "../streaming/receipt.js";

function base64UrlDecode(value: string): string {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    if (typeof globalThis.atob === "function") {
        const binary = globalThis.atob(normalized + padding);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
        return new TextDecoder("utf-8").decode(bytes);
    }
    return Buffer.from(normalized + padding, "base64").toString("utf-8");
}

function base64UrlEncode(value: string): string {
    if (typeof Buffer !== "undefined") {
        return Buffer.from(value, "utf-8").toString("base64")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
    const bytes = new TextEncoder().encode(value);
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return globalThis.btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export function encodePaymentPayload(payload: PaymentPayload): string {
    return base64UrlEncode(JSON.stringify(payload));
}

export function encodePaymentSignature(value: string | PaymentPayload): string {
    return typeof value === "string" ? value : encodePaymentPayload(value);
}

export class FacilitatorResource {
    constructor(private readonly client: HttpClient) {}

    supported(): APIPromise<FacilitatorSupportedResponse> {
        return this.client.request<FacilitatorSupportedResponse>({
            method: "GET",
            path: "/api/x402/facilitator/supported",
        });
    }

    chains(): APIPromise<FacilitatorChainsResponse> {
        return this.client.request<FacilitatorChainsResponse>({
            method: "GET",
            path: "/api/x402/facilitator/chains",
        });
    }

    verify(body: { x402Version: 2; paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements }): APIPromise<VerifyResponse> {
        return this.client.request<VerifyResponse>({
            method: "POST",
            path: "/api/x402/facilitator/verify",
            body,
        });
    }

    settle(body: { x402Version: 2; paymentPayload: PaymentPayload; paymentRequirements: PaymentRequirements }): APIPromise<SettleResponse> {
        return this.client.request<SettleResponse>({
            method: "POST",
            path: "/api/x402/facilitator/settle",
            body,
        });
    }
}

export class X402Resource {
    readonly facilitator: FacilitatorResource;

    constructor(client: HttpClient) {
        this.facilitator = new FacilitatorResource(client);
    }

    /**
     * Decode the base64-url PAYMENT-REQUIRED header into a typed
     * `PaymentRequired` body. Throws on malformed input.
     */
    decodePaymentRequired(headerValue: string): PaymentRequired {
        return JSON.parse(base64UrlDecode(headerValue)) as PaymentRequired;
    }

    /**
     * Decode the base64-url PAYMENT-RESPONSE header into a typed
     * `SettleResponse` body. Throws on malformed input.
     */
    decodePaymentResponse(headerValue: string): SettleResponse {
        return JSON.parse(base64UrlDecode(headerValue)) as SettleResponse;
    }

    /**
     * Encode a signed x402 `PaymentPayload` for the PAYMENT-SIGNATURE header.
     * If a signer already returned a string, this returns it unchanged.
     */
    encodePaymentSignature(value: string | PaymentPayload): string {
        return encodePaymentSignature(value);
    }

    /**
     * Decode the base64-url X-Compose-Receipt header. Throws on malformed input.
     */
    decodeReceipt(headerValue: string): ComposeReceipt {
        return decodeReceiptHeader(headerValue);
    }
}

import type { APIPromise, HttpClient } from "../http.js";
import { x402Client } from "@x402/core/client";
import { ExactEvmScheme, toClientEvmSigner, type ClientEvmSigner } from "@x402/evm";
import { UptoEvmScheme } from "@x402/evm/upto/client";
import { createPublicClient, http, type Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import type {
    ComposePaymentMode,
    ComposeReceipt,
    FacilitatorChainsResponse,
    FacilitatorSupportedResponse,
    PaymentPayload,
    PaymentRequired,
    PaymentRequirements,
    SettleResponse,
    VerifyResponse,
    X402PaymentSigner,
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

export function createX402EvmSigner(
    signer: ClientEvmSigner,
    options: { rpcUrl?: string; schemes?: Array<"upto" | "exact"> } = {},
): X402PaymentSigner {
    const schemes = options.schemes ?? ["upto", "exact"];
    const client = new x402Client();
    const schemeOptions = options.rpcUrl ? { rpcUrl: options.rpcUrl } : undefined;

    if (schemes.includes("upto")) {
        client.register("eip155:*", new UptoEvmScheme(signer, schemeOptions));
    }
    if (schemes.includes("exact")) {
        client.register("eip155:*", new ExactEvmScheme(signer, schemeOptions));
    }

    return async (request) => {
        const paymentRequired = filterPaymentRequiredByMaxAmount(request.paymentRequired, request.maxAmountWei);
        return client.createPaymentPayload(paymentRequired as never) as Promise<PaymentPayload>;
    };
}

export function createPrivateKeyX402EvmSigner(
    input: { privateKey: string; rpcUrl?: string; schemes?: Array<"upto" | "exact"> },
): X402PaymentSigner {
    return createPrivateKeyX402EvmWallet(input).x402Signer;
}

export function createPrivateKeyX402EvmWallet(
    input: { privateKey: string; rpcUrl?: string; schemes?: Array<"upto" | "exact"> },
): { address: `0x${string}`; x402Signer: X402PaymentSigner } {
    const privateKey = input.privateKey.startsWith("0x") ? input.privateKey : `0x${input.privateKey}`;
    const account = privateKeyToAccount(privateKey as Hex);
    const publicClient = input.rpcUrl
        ? createPublicClient({ transport: http(input.rpcUrl) })
        : undefined;
    const signer = toClientEvmSigner(account, publicClient);
    return {
        address: account.address,
        x402Signer: createX402EvmSigner(signer, {
            rpcUrl: input.rpcUrl,
            schemes: input.schemes,
        }),
    };
}

function filterPaymentRequiredByMaxAmount(paymentRequired: PaymentRequired, maxAmountWei?: string): PaymentRequired {
    if (!maxAmountWei) return paymentRequired;
    const max = BigInt(maxAmountWei);
    const accepts = paymentRequired.accepts.filter((accept) => BigInt(accept.amount) <= max);
    if (accepts.length === 0) {
        throw new Error("No x402 payment requirement fits within x402MaxAmountWei");
    }
    return { ...paymentRequired, accepts };
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

    constructor(
        client: HttpClient,
        private readonly fetchWithPayment?: (input: RequestInfo | URL, init?: RequestInit & { paymentMode?: ComposePaymentMode }) => Promise<Response>,
    ) {
        this.facilitator = new FacilitatorResource(client);
    }

    fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
        if (!this.fetchWithPayment) {
            return Promise.reject(new Error("x402.fetch is only available from a ComposeSDK instance."));
        }
        return this.fetchWithPayment(input, { ...(init ?? {}), paymentMode: "x402" });
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

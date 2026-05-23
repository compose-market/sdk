import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    DispenserCheckResponse,
    DispenserClaimInput,
    DispenserClaimResponse,
    DispenserStatusByChainResponse,
    DispenserStatusResponse,
} from "../types/index.js";

interface DispenserContext {
    getWalletMaybe(): { address: string | null; chainId: number | null };
}

interface DispenserRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}

function address(input: { address?: string }, fallback: string | null): string {
    const resolved = input.address ?? fallback;
    if (!resolved) {
        throw new BadRequestError({ message: "address is required. Attach a wallet or pass address." });
    }
    return resolved;
}

export class DispenserResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: DispenserContext,
    ) {}

    claim(input: DispenserClaimInput = {}, options: DispenserRequestOptions = {}): APIPromise<DispenserClaimResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const resolvedAddress = address(input, wallet.address);
        const chainId = input.chainId ?? wallet.chainId;
        if (chainId === null || chainId === undefined) {
            throw new BadRequestError({ message: "chainId is required. Attach a wallet or pass chainId." });
        }
        return this.client.request<DispenserClaimResponse>({
            method: "POST",
            path: "/api/dispenser/claim",
            body: {
                address: resolvedAddress,
                chainId,
            },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    status(options?: DispenserRequestOptions): APIPromise<DispenserStatusResponse>;
    status(chainId: number, options?: DispenserRequestOptions): APIPromise<DispenserStatusByChainResponse>;
    status(
        chainIdOrOptions?: number | DispenserRequestOptions,
        maybeOptions: DispenserRequestOptions = {},
    ): APIPromise<DispenserStatusResponse | DispenserStatusByChainResponse> {
        const chainId = typeof chainIdOrOptions === "number" ? chainIdOrOptions : undefined;
        const options = typeof chainIdOrOptions === "number" ? maybeOptions : chainIdOrOptions ?? {};
        return this.client.request<DispenserStatusResponse | DispenserStatusByChainResponse>({
            method: "GET",
            path: chainId === undefined ? "/api/dispenser/status" : `/api/dispenser/status/${encodeURIComponent(chainId)}`,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    check(input: { address?: string } = {}, options: DispenserRequestOptions = {}): APIPromise<DispenserCheckResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const resolvedAddress = address(input, wallet.address);
        return this.client.request<DispenserCheckResponse>({
            method: "GET",
            path: `/api/dispenser/check/${encodeURIComponent(resolvedAddress)}`,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

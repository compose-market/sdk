import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type { SettlementStatusInput, SettlementStatusResponse } from "../types/index.js";

interface SettlementContext {
    getWalletMaybe(): { address: string | null; chainId: number | null };
    getTokenMaybe(): string | null;
}

interface SettlementRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}

export class SettlementResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: SettlementContext,
    ) {}

    status(input: SettlementStatusInput = {}, options: SettlementRequestOptions = {}): APIPromise<SettlementStatusResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const userAddress = input.userAddress ?? wallet.address;
        const chainId = input.chainId ?? wallet.chainId ?? undefined;
        if (!userAddress) {
            throw new BadRequestError({ message: "userAddress is required. Attach a wallet or pass userAddress." });
        }
        return this.client.request<SettlementStatusResponse>({
            method: "GET",
            path: "/api/settlement/status",
            query: { chainId },
            headers: {
                composeKey: this.ctx.getTokenMaybe() ?? undefined,
                userAddress,
                chainId,
            },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

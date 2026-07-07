import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type { ReceiptListResponse } from "../types/index.js";

interface ReceiptsContext {
    getWalletMaybe(): { address: string | null; chainId: number | null };
    getTokenMaybe(): string | null;
}

export interface ReceiptListOptions {
    chainId?: number;
    limit?: number;
    signal?: AbortSignal;
    timeoutMs?: number;
}

function normalizeLimit(value: number | undefined): number | undefined {
    if (value === undefined) return undefined;
    if (!Number.isInteger(value) || value <= 0) {
        throw new BadRequestError({ message: "limit must be a positive integer" });
    }
    return Math.min(value, 100);
}

export class ReceiptsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: ReceiptsContext,
    ) {}

    list(input: ReceiptListOptions = {}): APIPromise<ReceiptListResponse> {
        const token = this.ctx.getTokenMaybe();
        if (!token) {
            throw new BadRequestError({
                message: "receipts.list() requires a Compose Key token. Call keys.use(token), keys.create(...), or pass composeKey via options.",
            });
        }

        const wallet = this.ctx.getWalletMaybe();
        const chainId = input.chainId ?? wallet.chainId;
        if (!chainId) {
            throw new BadRequestError({
                message: "receipts.list() needs a chainId, either in options or via sdk.wallets.attach(...).",
            });
        }

        return this.client.request<ReceiptListResponse>({
            method: "GET",
            path: "/api/receipts",
            query: {
                chainId,
                limit: normalizeLimit(input.limit),
            },
            headers: {
                composeKey: token,
                userAddress: wallet.address ?? undefined,
                chainId,
            },
            signal: input.signal,
            timeoutMs: input.timeoutMs,
        });
    }
}

import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    PermissionGrantInput,
    PermissionListInput,
    PermissionListResponse,
    PermissionRevokeInput,
    PermissionWriteResponse,
} from "../types/index.js";

interface Context {
    getWalletMaybe(): { address: string | null; chainId: number | null };
    getTokenMaybe(): string | null;
}

interface Options {
    signal?: AbortSignal;
    timeoutMs?: number;
}

function user(input: { userAddress?: string }, fallback: string | null): string {
    const resolved = input.userAddress ?? fallback;
    if (!resolved) {
        throw new BadRequestError({ message: "userAddress is required. Attach a wallet or pass userAddress." });
    }
    return resolved;
}

function agent(input: { agentWallet?: string }): string {
    if (!input.agentWallet) {
        throw new BadRequestError({ message: "agentWallet is required." });
    }
    return input.agentWallet;
}

function headers(ctx: Context, userAddress: string) {
    const wallet = ctx.getWalletMaybe();
    return {
        composeKey: ctx.getTokenMaybe() ?? undefined,
        userAddress,
        chainId: wallet.chainId ?? undefined,
    };
}

export class PermissionsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: Context,
    ) {}

    list(input: PermissionListInput, options: Options = {}): APIPromise<PermissionListResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<PermissionListResponse>({
            method: "GET",
            path: "/permissions",
            query: { userAddress, agentWallet },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    grant(input: PermissionGrantInput, options: Options = {}): APIPromise<PermissionWriteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<PermissionWriteResponse>({
            method: "POST",
            path: "/permissions",
            body: { ...input, userAddress, agentWallet },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    revoke(input: PermissionRevokeInput, options: Options = {}): APIPromise<PermissionWriteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<PermissionWriteResponse>({
            method: "DELETE",
            path: "/permissions",
            body: { ...input, userAddress, agentWallet },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

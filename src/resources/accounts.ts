import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    AccountConnectInput,
    AccountConnectResponse,
    AccountDisconnectInput,
    AccountDisconnectResponse,
    AccountExecuteInput,
    AccountExecuteResponse,
    AccountListInput,
    AccountListResponse,
    AccountStatusInput,
    AccountStatusResponse,
    AccountToolkitActionsInput,
    AccountToolkitActionsResponse,
    AccountToolkitsInput,
    AccountToolkitsResponse,
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

function account(input: { connectedAccountId?: string }): string {
    if (!input.connectedAccountId) {
        throw new BadRequestError({ message: "connectedAccountId is required." });
    }
    return input.connectedAccountId;
}

function headers(ctx: Context, userAddress?: string) {
    const wallet = ctx.getWalletMaybe();
    return {
        composeKey: ctx.getTokenMaybe() ?? undefined,
        userAddress: userAddress ?? wallet.address ?? undefined,
        chainId: wallet.chainId ?? undefined,
    };
}

export class AccountToolkitsResource {
    constructor(private readonly client: HttpClient) {}

    list(input: AccountToolkitsInput = {}, options: Options = {}): APIPromise<AccountToolkitsResponse> {
        return this.client.request<AccountToolkitsResponse>({
            method: "GET",
            path: "/accounts/toolkits",
            query: { search: input.search, limit: input.limit },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    actions(toolkit: string, input: AccountToolkitActionsInput = {}, options: Options = {}): APIPromise<AccountToolkitActionsResponse> {
        return this.client.request<AccountToolkitActionsResponse>({
            method: "GET",
            path: `/accounts/toolkits/${encodeURIComponent(toolkit)}/actions`,
            query: { limit: input.limit },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class AccountsResource {
    readonly toolkits: AccountToolkitsResource;

    constructor(
        private readonly client: HttpClient,
        private readonly ctx: Context,
    ) {
        this.toolkits = new AccountToolkitsResource(client);
    }

    connect(input: AccountConnectInput, options: Options = {}): APIPromise<AccountConnectResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<AccountConnectResponse>({
            method: "POST",
            path: "/accounts/connect",
            body: { ...input, userAddress, agentWallet },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    list(input: AccountListInput, options: Options = {}): APIPromise<AccountListResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<AccountListResponse>({
            method: "GET",
            path: "/accounts",
            query: { userAddress, agentWallet, toolkit: input.toolkit },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    status(input: AccountStatusInput, options: Options = {}): APIPromise<AccountStatusResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        const connectedAccountId = account(input);
        return this.client.request<AccountStatusResponse>({
            method: "GET",
            path: "/accounts/status",
            query: { userAddress, agentWallet, toolkit: input.toolkit, connectedAccountId },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    execute(input: AccountExecuteInput, options: Options = {}): APIPromise<AccountExecuteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        const connectedAccountId = account(input);
        return this.client.request<AccountExecuteResponse>({
            method: "POST",
            path: "/accounts/execute",
            body: { ...input, userAddress, agentWallet, connectedAccountId },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    disconnect(input: AccountDisconnectInput, options: Options = {}): APIPromise<AccountDisconnectResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        const connectedAccountId = account(input);
        return this.client.request<AccountDisconnectResponse>({
            method: "DELETE",
            path: "/accounts",
            body: { ...input, userAddress, agentWallet, connectedAccountId },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

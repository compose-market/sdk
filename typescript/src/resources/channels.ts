import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    ChannelDisconnectInput,
    ChannelDisconnectResponse,
    ChannelGetResponse,
    ChannelLinkInput,
    ChannelLinkResponse,
    ChannelListResponse,
    ChannelName,
    ChannelStatusInput,
    ChannelStatusResponse,
} from "../types/index.js";

interface Context {
    getWalletMaybe(): { address: string | null; chainId: number | null };
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

export class ChannelsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: Context,
    ) {}

    list(options: Options = {}): APIPromise<ChannelListResponse> {
        return this.client.request<ChannelListResponse>({
            method: "GET",
            path: "/channels",
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    get(channel: ChannelName, options: Options = {}): APIPromise<ChannelGetResponse> {
        return this.client.request<ChannelGetResponse>({
            method: "GET",
            path: `/channels/${encodeURIComponent(channel)}`,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    link(channel: ChannelName, input: ChannelLinkInput, options: Options = {}): APIPromise<ChannelLinkResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<ChannelLinkResponse>({
            method: "POST",
            path: `/channels/${encodeURIComponent(channel)}/link`,
            body: { ...input, userAddress, agentWallet },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    status(channel: ChannelName, input: ChannelStatusInput, options: Options = {}): APIPromise<ChannelStatusResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<ChannelStatusResponse>({
            method: "GET",
            path: `/channels/${encodeURIComponent(channel)}/status`,
            query: { userAddress, agentWallet, accountId: input.accountId, threadId: input.threadId },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    disconnect(channel: ChannelName, input: ChannelDisconnectInput, options: Options = {}): APIPromise<ChannelDisconnectResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        const agentWallet = agent(input);
        return this.client.request<ChannelDisconnectResponse>({
            method: "POST",
            path: `/channels/${encodeURIComponent(channel)}/disconnect`,
            body: { ...input, userAddress, agentWallet },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

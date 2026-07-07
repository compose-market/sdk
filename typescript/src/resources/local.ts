import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    LocalDeploymentRegisterInput,
    LocalDeploymentRegisterResponse,
    LocalFilecoinPinSessionInput,
    LocalFilecoinPinSessionResponse,
    LocalLinkCreateInput,
    LocalLinkCreateResponse,
    LocalLinkRedeemInput,
    LocalLinkRedeemResponse,
    LocalNetworkPeersInput,
    LocalNetworkPeersResponse,
    LocalNetworkUpsertInput,
    LocalNetworkUpsertResponse,
    LocalSynapseSessionInput,
    LocalSynapseSessionResponse,
} from "../types/index.js";

interface Wallet {
    address: string | null;
    chainId: number | null;
}

interface LocalContext {
    getWalletMaybe(): Wallet;
    getTokenMaybe(): string | null;
}

interface LocalRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}

function user(input: { userAddress?: string }, wallet: Wallet): string {
    const resolved = input.userAddress ?? wallet.address;
    if (!resolved) {
        throw new BadRequestError({ message: "userAddress is required. Attach a wallet or pass userAddress." });
    }
    return resolved;
}

function chain(input: { chainId?: number }, wallet: Wallet): number | undefined {
    return input.chainId ?? wallet.chainId ?? undefined;
}

function headers(ctx: LocalContext, wallet: Wallet, chainId?: number) {
    return {
        composeKey: ctx.getTokenMaybe() ?? undefined,
        userAddress: wallet.address ?? undefined,
        chainId,
    };
}

export class LocalLinkResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: LocalContext,
    ) {}

    create(input: LocalLinkCreateInput, options: LocalRequestOptions = {}): APIPromise<LocalLinkCreateResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const userAddress = user(input, wallet);
        const chainId = chain(input, wallet);
        return this.client.request<LocalLinkCreateResponse>({
            method: "POST",
            path: "/api/local/link-token",
            body: { ...input, userAddress, chainId },
            headers: headers(this.ctx, { ...wallet, address: userAddress }, chainId),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    redeem(input: LocalLinkRedeemInput, options: LocalRequestOptions = {}): APIPromise<LocalLinkRedeemResponse> {
        return this.client.request<LocalLinkRedeemResponse>({
            method: "POST",
            path: "/api/local/link-token/redeem",
            body: input,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class LocalDeploymentsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: LocalContext,
    ) {}

    register(input: LocalDeploymentRegisterInput, options: LocalRequestOptions = {}): APIPromise<LocalDeploymentRegisterResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const userAddress = user(input, wallet);
        const chainId = chain(input, wallet);
        return this.client.request<LocalDeploymentRegisterResponse>({
            method: "POST",
            path: "/api/local/deployments/register",
            body: { ...input, userAddress, chainId },
            headers: headers(this.ctx, { ...wallet, address: userAddress }, chainId),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

export class LocalNetworkResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: LocalContext,
    ) {}

    upsert(input: LocalNetworkUpsertInput, options: LocalRequestOptions = {}): APIPromise<LocalNetworkUpsertResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const userAddress = user(input, wallet);
        const chainId = chain(input, wallet);
        return this.client.request<LocalNetworkUpsertResponse>({
            method: "POST",
            path: "/api/local/network/peers/upsert",
            body: { ...input, userAddress, chainId },
            headers: headers(this.ctx, { ...wallet, address: userAddress }, chainId),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    peers(input: LocalNetworkPeersInput = {}, options: LocalRequestOptions = {}): APIPromise<LocalNetworkPeersResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const userAddress = user(input, wallet);
        const chainId = chain(input, wallet);
        return this.client.request<LocalNetworkPeersResponse>({
            method: "GET",
            path: "/api/local/network/peers",
            query: {
                userAddress,
                chainId,
                agentWallet: input.agentWallet,
            },
            headers: headers(this.ctx, { ...wallet, address: userAddress }, chainId),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class LocalSynapseResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: LocalContext,
    ) {}

    session(input: LocalSynapseSessionInput, options: LocalRequestOptions = {}): APIPromise<LocalSynapseSessionResponse> {
        const wallet = this.ctx.getWalletMaybe();
        return this.client.request<LocalSynapseSessionResponse>({
            method: "POST",
            path: "/api/local/synapse/session",
            body: input,
            headers: headers(this.ctx, wallet, wallet.chainId ?? undefined),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

export class LocalFilecoinResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: LocalContext,
    ) {}

    session(input: LocalFilecoinPinSessionInput, options: LocalRequestOptions = {}): APIPromise<LocalFilecoinPinSessionResponse> {
        const wallet = this.ctx.getWalletMaybe();
        return this.client.request<LocalFilecoinPinSessionResponse>({
            method: "POST",
            path: "/api/local/filecoin-pin/session",
            body: input,
            headers: headers(this.ctx, wallet, wallet.chainId ?? undefined),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

export class LocalResource {
    readonly link: LocalLinkResource;
    readonly deployments: LocalDeploymentsResource;
    readonly network: LocalNetworkResource;
    readonly synapse: LocalSynapseResource;
    readonly filecoin: LocalFilecoinResource;

    constructor(client: HttpClient, ctx: LocalContext) {
        this.link = new LocalLinkResource(client, ctx);
        this.deployments = new LocalDeploymentsResource(client, ctx);
        this.network = new LocalNetworkResource(client, ctx);
        this.synapse = new LocalSynapseResource(client, ctx);
        this.filecoin = new LocalFilecoinResource(client, ctx);
    }
}

import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    BackpackConnectInput,
    BackpackConnectResponse,
    BackpackConnectionsInput,
    BackpackConnectionsResponse,
    BackpackDisconnectInput,
    BackpackDisconnectResponse,
    BackpackExecuteInput,
    BackpackExecuteResponse,
    BackpackPermissionGrantInput,
    BackpackPermissionListInput,
    BackpackPermissionListResponse,
    BackpackPermissionRevokeInput,
    BackpackPermissionWriteResponse,
    BackpackStatusInput,
    BackpackStatusResponse,
    BackpackTelegramLinkInput,
    BackpackTelegramLinkResponse,
    BackpackTelegramStatusInput,
    BackpackTelegramStatusResponse,
    BackpackToolkitActionsInput,
    BackpackToolkitActionsResponse,
    BackpackToolkitsInput,
    BackpackToolkitsResponse,
} from "../types/index.js";

interface BackpackContext {
    getWalletMaybe(): { address: string | null; chainId: number | null };
    getTokenMaybe(): string | null;
}

interface BackpackRequestOptions {
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

function headers(ctx: BackpackContext, userAddress?: string) {
    const wallet = ctx.getWalletMaybe();
    return {
        composeKey: ctx.getTokenMaybe() ?? undefined,
        userAddress: userAddress ?? wallet.address ?? undefined,
        chainId: wallet.chainId ?? undefined,
    };
}

export class BackpackPermissionsResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: BackpackContext,
    ) {}

    list(input: BackpackPermissionListInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackPermissionListResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackPermissionListResponse>({
            method: "GET",
            path: "/api/backpack/permissions",
            query: { userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    grant(input: BackpackPermissionGrantInput, options: BackpackRequestOptions = {}): APIPromise<BackpackPermissionWriteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackPermissionWriteResponse>({
            method: "POST",
            path: "/api/backpack/permissions/grant",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    revoke(input: BackpackPermissionRevokeInput, options: BackpackRequestOptions = {}): APIPromise<BackpackPermissionWriteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackPermissionWriteResponse>({
            method: "POST",
            path: "/api/backpack/permissions/revoke",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

export class BackpackToolkitsResource {
    constructor(private readonly client: HttpClient) {}

    list(input: BackpackToolkitsInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackToolkitsResponse> {
        return this.client.request<BackpackToolkitsResponse>({
            method: "GET",
            path: "/api/backpack/toolkits",
            query: {
                search: input.search,
                limit: input.limit,
            },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    actions(toolkit: string, input: BackpackToolkitActionsInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackToolkitActionsResponse> {
        return this.client.request<BackpackToolkitActionsResponse>({
            method: "GET",
            path: `/api/backpack/toolkits/${encodeURIComponent(toolkit)}/actions`,
            query: { limit: input.limit },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class BackpackTelegramResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: BackpackContext,
    ) {}

    link(input: BackpackTelegramLinkInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackTelegramLinkResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackTelegramLinkResponse>({
            method: "POST",
            path: "/api/backpack/telegram/link",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    status(input: BackpackTelegramStatusInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackTelegramStatusResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackTelegramStatusResponse>({
            method: "GET",
            path: "/api/backpack/telegram/status",
            query: { userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class BackpackResource {
    readonly permissions: BackpackPermissionsResource;
    readonly toolkits: BackpackToolkitsResource;
    readonly telegram: BackpackTelegramResource;

    constructor(
        private readonly client: HttpClient,
        private readonly ctx: BackpackContext,
    ) {
        this.permissions = new BackpackPermissionsResource(client, ctx);
        this.toolkits = new BackpackToolkitsResource(client);
        this.telegram = new BackpackTelegramResource(client, ctx);
    }

    connect(input: BackpackConnectInput, options: BackpackRequestOptions = {}): APIPromise<BackpackConnectResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackConnectResponse>({
            method: "POST",
            path: "/api/backpack/connect",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    connections(input: BackpackConnectionsInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackConnectionsResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackConnectionsResponse>({
            method: "GET",
            path: "/api/backpack/connections",
            query: { userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    status(toolkit: string, input: BackpackStatusInput = {}, options: BackpackRequestOptions = {}): APIPromise<BackpackStatusResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackStatusResponse>({
            method: "GET",
            path: `/api/backpack/status/${encodeURIComponent(toolkit)}`,
            query: { userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    disconnect(input: BackpackDisconnectInput, options: BackpackRequestOptions = {}): APIPromise<BackpackDisconnectResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackDisconnectResponse>({
            method: "POST",
            path: "/api/backpack/disconnect",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }

    execute(input: BackpackExecuteInput, options: BackpackRequestOptions = {}): APIPromise<BackpackExecuteResponse> {
        const userAddress = user(input, this.ctx.getWalletMaybe().address);
        return this.client.request<BackpackExecuteResponse>({
            method: "POST",
            path: "/api/backpack/execute",
            body: { ...input, userAddress },
            headers: headers(this.ctx, userAddress),
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            doNotRetry: true,
        });
    }
}

import type { HttpClient } from "../http.js";
import type {
    ActiveSessionMetadata,
    ComposeKeyCreateResponse,
    ComposeKeyPurpose,
    ComposeKeyRecord,
} from "../types/index.js";
import { BadRequestError } from "../errors.js";

export interface KeyCreateParams {
    purpose: ComposeKeyPurpose;
    budgetUsd?: number;
    budgetWei?: number | string;
    durationHours?: number;
    expiresAt?: number;
    chainId?: number;
    name?: string;
}

function toBudgetWei(input: Pick<KeyCreateParams, "budgetUsd" | "budgetWei">): number {
    const hasUsd = typeof input.budgetUsd === "number";
    const hasWei = typeof input.budgetWei === "number" || typeof input.budgetWei === "string";

    if (Number(hasUsd) + Number(hasWei) !== 1) {
        throw new BadRequestError({ message: "provide exactly one of budgetUsd or budgetWei" });
    }

    if (hasUsd) {
        const usd = input.budgetUsd!;
        if (!Number.isFinite(usd) || usd <= 0) {
            throw new BadRequestError({ message: "budgetUsd must be a positive number" });
        }
        return Math.round(usd * 1_000_000);
    }

    if (typeof input.budgetWei === "number") {
        if (!Number.isInteger(input.budgetWei) || input.budgetWei <= 0) {
            throw new BadRequestError({ message: "budgetWei must be a positive integer" });
        }
        return input.budgetWei;
    }

    const trimmed = String(input.budgetWei).trim();
    if (!/^\d+$/.test(trimmed)) {
        throw new BadRequestError({ message: "budgetWei must be a positive integer string" });
    }
    const parsed = Number(trimmed);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new BadRequestError({ message: "budgetWei must be a positive integer string" });
    }
    return parsed;
}

function resolveExpiresAt(input: Pick<KeyCreateParams, "durationHours" | "expiresAt">): number {
    const hasDuration = typeof input.durationHours === "number";
    const hasExpires = typeof input.expiresAt === "number";

    if (Number(hasDuration) + Number(hasExpires) !== 1) {
        throw new BadRequestError({ message: "provide exactly one of durationHours or expiresAt" });
    }

    if (hasExpires) {
        if (!Number.isInteger(input.expiresAt) || input.expiresAt! <= Date.now()) {
            throw new BadRequestError({ message: "expiresAt must be a future unix timestamp in milliseconds" });
        }
        return input.expiresAt!;
    }

    const hours = input.durationHours!;
    if (!Number.isFinite(hours) || hours <= 0) {
        throw new BadRequestError({ message: "durationHours must be a positive number" });
    }
    return Date.now() + Math.round(hours * 60 * 60 * 1000);
}

export class KeysResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: {
            getWallet(): { address: string; chainId: number };
            getWalletMaybe(): { address: string | null; chainId: number | null };
            setToken(token: string): void;
            getToken(): string | null;
            clearToken(): void;
        },
    ) {}

    async create(input: KeyCreateParams): Promise<ComposeKeyCreateResponse> {
        const wallet = this.ctx.getWallet();
        const chainId = input.chainId ?? wallet.chainId;

        const body = {
            budgetLimit: toBudgetWei(input),
            expiresAt: resolveExpiresAt(input),
            chainId,
            purpose: input.purpose,
            ...(input.name ? { name: input.name } : {}),
        };

        const response = await this.client.request<ComposeKeyCreateResponse>({
            method: "POST",
            path: "/api/keys",
            body,
            headers: {
                userAddress: wallet.address,
                chainId,
            },
        });

        // The token is returned exactly once by POST /api/keys. We persist it
        // on the client so subsequent calls carry Authorization automatically.
        this.ctx.setToken(response.token);
        return response;
    }

    async getActive(input: { chainId?: number } = {}): Promise<ActiveSessionMetadata> {
        const wallet = this.ctx.getWallet();
        const chainId = input.chainId ?? wallet.chainId;
        return this.client.request<ActiveSessionMetadata>({
            method: "GET",
            path: "/api/session",
            headers: {
                userAddress: wallet.address,
                chainId,
            },
        });
    }

    async list(): Promise<ComposeKeyRecord[]> {
        const wallet = this.ctx.getWallet();
        const result = await this.client.request<{ keys: ComposeKeyRecord[] }>({
            method: "GET",
            path: "/api/keys",
            headers: {
                userAddress: wallet.address,
                chainId: wallet.chainId,
            },
        });
        return result.keys;
    }

    /**
     * Inspect a specific key. Requires the SDK to hold a valid Compose Key
     * token (via `keys.use(token)`, `keys.create(...)`, or the constructor).
     * The server authorises based on JWT-owner matching the key's owner, so
     * any live token for the same wallet is sufficient.
     */
    async get(keyId: string): Promise<ComposeKeyRecord> {
        const token = this.ctx.getToken();
        if (!token) {
            throw new BadRequestError({
                message: "keys.get() requires a Compose Key token. Call keys.use(token) first or pass composeKey via options.",
            });
        }
        const wallet = this.ctx.getWalletMaybe();
        return this.client.request<ComposeKeyRecord>({
            method: "GET",
            path: `/api/keys/${encodeURIComponent(keyId)}`,
            headers: {
                composeKey: token,
                userAddress: wallet.address ?? undefined,
                chainId: wallet.chainId ?? undefined,
            },
        });
    }

    /**
     * Revoke a key. Requires the SDK to hold a valid Compose Key token for
     * the same wallet. The server accepts either the target key's own JWT or
     * any other live JWT belonging to the same owner (so users can revoke
     * their API keys using their active session token, and vice versa).
     */
    async revoke(keyId: string): Promise<{ success: boolean; keyId: string }> {
        const token = this.ctx.getToken();
        if (!token) {
            throw new BadRequestError({
                message: "keys.revoke() requires a Compose Key token. Call keys.use(token) first or pass composeKey via options.",
            });
        }
        const wallet = this.ctx.getWalletMaybe();
        const result = await this.client.request<{ success: boolean; keyId: string }>({
            method: "DELETE",
            path: `/api/keys/${encodeURIComponent(keyId)}`,
            headers: {
                composeKey: token,
                userAddress: wallet.address ?? undefined,
                chainId: wallet.chainId ?? undefined,
            },
            doNotRetry: true,
        });
        return result;
    }

    use(token: string): void {
        this.ctx.setToken(token);
    }

    currentToken(): string | null {
        return this.ctx.getToken();
    }

    clearToken(): void {
        this.ctx.clearToken();
    }
}

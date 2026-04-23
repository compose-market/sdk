/**
 * Pluggable storage for persisting the Compose Key JWT across process
 * restarts (browser reload, serverless cold start, etc).
 *
 * The SDK stays framework-agnostic by not importing any browser or Node
 * storage API directly. Integrators pass a minimal adapter; the SDK
 * auto-detects `globalThis.localStorage` when none is provided but runs in a
 * browser, and falls back to an in-memory Map everywhere else.
 *
 * Storage is scoped per `(userAddress, chainId)` tuple so multiple wallets /
 * chains on the same device never collide.
 */

export interface ComposeStorage {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
    removeItem(key: string): void;
}

export function resolveStorage(explicit: ComposeStorage | undefined): ComposeStorage | null {
    if (explicit) return explicit;

    // Browser / Deno / Cloudflare Workers with localStorage polyfills.
    const candidate = (globalThis as { localStorage?: unknown }).localStorage;
    if (candidate && typeof candidate === "object") {
        const ls = candidate as ComposeStorage;
        if (typeof ls.getItem === "function" && typeof ls.setItem === "function" && typeof ls.removeItem === "function") {
            return ls;
        }
    }

    // Node / server runtimes without a persistent store: return null so the
    // SDK falls back to in-memory only. Integrators who want cross-restart
    // persistence in those environments pass an explicit adapter.
    return null;
}

export function createMemoryStorage(): ComposeStorage {
    const map = new Map<string, string>();
    return {
        getItem: (key) => map.get(key) ?? null,
        setItem: (key, value) => { map.set(key, value); },
        removeItem: (key) => { map.delete(key); },
    };
}

/**
 * Build the scoped storage key for a persisted Compose Key token. The shape
 * `compose.sdk.token:<lower-address>:<chainId>` mirrors the convention already
 * in use by web/ so multiple SDK instances + the bare web app never collide.
 */
export function buildTokenStorageKey(tokenScope: string, userAddress: string, chainId: number): string {
    return `${tokenScope}:${userAddress.toLowerCase()}:${chainId}`;
}

export const DEFAULT_TOKEN_SCOPE = "compose.sdk.token";

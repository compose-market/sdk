import { HTTPClient } from "./http.js";
import { Logger } from "./logger.js";
import { RetryConfig } from "./retries.js";
/**
 * Production x402 endpoint
 */
export declare const ServerX402 = "x402";
/**
 * Local x402 development endpoint
 */
export declare const ServerLocal = "local";
/**
 * Contains the list of servers available to the SDK
 */
export declare const ServerList: {
    readonly x402: "https://api.compose.market";
    readonly local: "http://127.0.0.1:3000";
};
export type SDKOptions = {
    keyAuth?: string | (() => Promise<string>) | undefined;
    httpClient?: HTTPClient;
    /**
     * Allows overriding the default server used by the SDK
     */
    server?: keyof typeof ServerList | undefined;
    /**
     * Allows overriding the default server URL used by the SDK
     */
    serverURL?: string | undefined;
    /**
     * Allows overriding the default user agent used by the SDK
     */
    userAgent?: string | undefined;
    /**
     * Allows overriding the default retry config used by the SDK
     */
    retryConfig?: RetryConfig;
    timeoutMs?: number;
    debugLogger?: Logger;
};
export declare function serverURLFromOptions(options: SDKOptions): URL | null;
export declare const SDK_METADATA: {
    readonly language: "typescript";
    readonly openapiDocVersion: "0.8.9";
    readonly sdkVersion: "0.8.9";
    readonly genVersion: "2.916.2";
    readonly userAgent: "speakeasy-sdk/typescript 0.8.9 2.916.2 0.8.7 openapi";
};
//# sourceMappingURL=config.d.ts.map
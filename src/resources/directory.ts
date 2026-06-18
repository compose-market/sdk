import type { APIPromise, HttpClient } from "../http.js";
import type {
    AgentverseQuery,
    AgentverseResponse,
    DirectoryAgent,
    DirectoryAgentListResponse,
    DirectoryWorkflow,
    DirectoryWorkflowListResponse,
} from "../types/index.js";

export interface DirectoryRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
}

export interface DirectoryAgentListInput extends DirectoryRequestOptions {
    limit?: number;
    cursor?: string | null;
    q?: string;
    query?: string;
    sort?: "newest" | "price-low" | "price-high" | "name";
    creator?: string;
    chain?: number | string;
    framework?: string;
    cloneable?: boolean;
    skill?: string;
    plugin?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
}

export class DirectoryAgentsResource {
    constructor(private readonly client: HttpClient) { }

    list(input: DirectoryAgentListInput = {}, options: DirectoryRequestOptions = {}): APIPromise<DirectoryAgentListResponse> {
        return this.client.request<DirectoryAgentListResponse>({
            method: "GET",
            path: "/agents",
            query: {
                limit: input.limit,
                cursor: input.cursor || undefined,
                q: input.q || input.query,
                sort: input.sort,
                creator: input.creator,
                chain: input.chain,
                framework: input.framework,
                cloneable: typeof input.cloneable === "boolean" ? String(input.cloneable) : undefined,
                skill: input.skill,
                plugin: input.plugin,
                minPrice: input.minPrice,
                maxPrice: input.maxPrice,
            },
            signal: options.signal ?? input.signal,
            timeoutMs: options.timeoutMs ?? input.timeoutMs,
        });
    }

    search(
        query: string,
        input: { limit?: number } = {},
        options: DirectoryRequestOptions = {},
    ): APIPromise<DirectoryAgentListResponse> {
        return this.client.request<DirectoryAgentListResponse>({
            method: "GET",
            path: "/agents/search",
            query: {
                q: query,
                limit: input.limit,
            },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    get(walletAddress: string, options: DirectoryRequestOptions = {}): APIPromise<DirectoryAgent> {
        return this.client.request<DirectoryAgent>({
            method: "GET",
            path: `/agent/${encodeURIComponent(walletAddress)}`,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    agentverse(input: AgentverseQuery = {}, options: DirectoryRequestOptions = {}): APIPromise<AgentverseResponse> {
        return this.client.request<AgentverseResponse>({
            method: "GET",
            path: "/api/agentverse/agents",
            query: {
                search: input.search,
                q: input.q,
                category: input.category,
                tags: input.tags?.join(","),
                limit: input.limit,
                offset: input.offset,
                sort: input.sort,
                direction: input.direction,
            },
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class DirectoryWorkflowsResource {
    constructor(private readonly client: HttpClient) { }

    list(options: DirectoryRequestOptions = {}): APIPromise<DirectoryWorkflowListResponse> {
        return this.client.request<DirectoryWorkflowListResponse>({
            method: "GET",
            path: "/workflows",
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }

    get(walletAddress: string, options: DirectoryRequestOptions = {}): APIPromise<DirectoryWorkflow> {
        return this.client.request<DirectoryWorkflow>({
            method: "GET",
            path: `/workflow/${encodeURIComponent(walletAddress)}`,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
        });
    }
}

export class DirectoryResource {
    readonly agents: DirectoryAgentsResource;
    readonly workflows: DirectoryWorkflowsResource;

    constructor(client: HttpClient) {
        this.agents = new DirectoryAgentsResource(client);
        this.workflows = new DirectoryWorkflowsResource(client);
    }
}

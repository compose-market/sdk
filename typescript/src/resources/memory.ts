/**
 * Compose memory — first-party 6-layer memory framework.
 *
 *   working  → Mongo `sessions`        rolling per-thread context
 *   scene    → Mongo `session_transcripts`  full transcripts
 *   graph    → Mongo `memory` (source:"fact")  durable user facts
 *   patterns → Mongo `patterns`        mined tool sequences
 *   archives → Mongo `archives` + Pinata  cold storage
 *   vectors  → Mongo `memory` (source:"session"|"knowledge")  hybrid recall
 *
 * One unified ranker (Cloudflare BAAI bge-reranker-base + temporal decay +
 * MMR) shortlists items across all layers into a budget-bounded prompt block.
 *
 * The 80%-case surface for agent loops is three calls:
 *   - `sdk.memory.context({ query, agentWallet, userAddress })` → pre-turn block
 *   - `sdk.memory.recordTurn({ messages, agentWallet, userAddress, threadId })` → post-turn persist
 *   - `sdk.memory.remember({ content, agentWallet, userAddress })` → durable fact
 *
 * Or even simpler ergonomic shortcuts:
 *   - `sdk.memory.recall("what's my favourite color?", { agentWallet, userAddress })`
 *   - `sdk.memory.save("my favourite color is azure", { agentWallet, userAddress })`
 *
 * The runtime owns ranking, budget enforcement, layer selection, and fact
 * extraction. The SDK is a thin transport.
 */
import type { APIPromise, HttpClient, RequestOptions } from "../http.js";
import type {
    AgentMemoryContextParams,
    AgentMemoryContextResponse,
    AgentMemoryLoopParams,
    AgentMemoryLoopResponse,
    AgentMemoryRecordTurnParams,
    AgentMemoryRecordTurnResponse,
    AgentMemoryRememberParams,
    AgentMemoryRememberResponse,
    LearnedSkill,
    LayeredSearchParams,
    LayeredSearchResult,
    MemoryEvalRunParams,
    MemoryEvalRunResponse,
    MemoryItemDeleteParams,
    MemoryItemQuery,
    MemoryItemUpdateParams,
    MemoryJobCreateParams,
    MemoryJobRecord,
    MemoryPatternValidation,
    MemoryScheduleStatus,
    MemoryVector,
    MemoryLoopManifest,
    ProceduralPattern,
    SessionMemory,
} from "../types/index.js";
import { BadRequestError } from "../errors.js";

export interface MemoryResourceContext {
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
}

export interface MemoryRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
    idempotencyKey?: string;
}

function validateMemoryScopePayload(body: unknown): void {
    if (!body || typeof body !== "object" || Array.isArray(body)) return;
    const payload = body as Record<string, unknown>;

    if (payload.mode === "global" || payload.mode === "local") {
        throw new BadRequestError({ message: 'Memory scope uses `scope`, not `mode`.' });
    }
    if (payload.scope === "local" && (typeof payload.haiId !== "string" || payload.haiId.trim().length === 0)) {
        throw new BadRequestError({ message: 'Memory scope "local" requires `haiId`.' });
    }
}

/**
 * Shorthand options for the ergonomic helpers `recall` and `save`.
 * Scope (`agentWallet` + `userAddress`) is required; everything else is
 * either auto-defaulted by the runtime or an opt-in tuning knob.
 */
export interface MemoryShorthandOptions {
    agentWallet: string;
    userAddress?: string;
    threadId?: string;
    scope?: "global" | "local";
    haiId?: string;
    /** Recall: max items in the returned prompt block. Default 6. */
    limit?: number;
    /** Recall: max characters in the returned prompt block. Default 900. */
    budgetCharacters?: number;
    /** Remember: confidence override (default 1 for explicit saves). */
    confidence?: number;
    /** Remember: durable-fact category. Default "context". */
    type?: "preference" | "identity" | "context" | "skill" | "relationship" | "event";
    request?: MemoryRequestOptions;
}

export class MemoryResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: MemoryResourceContext,
    ) { }

    /**
     * Pre-turn context retrieval. Returns a budget-bounded prompt block
     * shortlisting top items across all 6 layers.
     */
    context(params: AgentMemoryContextParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryContextResponse> {
        return this.request("POST", "/api/memory/context/assemble", params, options);
    }

    /**
     * Post-turn persistence. Persists transcript + working memory + per-turn
     * vector + extracts durable facts (graph layer). Idempotent on `turnId`.
     */
    recordTurn(params: AgentMemoryRecordTurnParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryRecordTurnResponse> {
        return this.request("POST", "/api/memory/turns/record", params, options, undefined, true);
    }

    /**
     * Save an explicit durable fact. Indexed as a `source:"fact"` vector with
     * `metadata.layer:"graph"` so the cross-layer ranker surfaces it.
     */
    remember(params: AgentMemoryRememberParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryRememberResponse> {
        return this.request("POST", "/api/memory/remember", params, options, undefined, true);
    }

    /**
     * Unified loop dispatcher — same as calling `context`/`recordTurn`/`remember`
     * directly but lets you pass a discriminated union, useful when the
     * caller's step is dynamic.
     */
    loop(params: AgentMemoryLoopParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryLoopResponse> {
        return this.request("POST", "/api/memory/loop", params, options, undefined, params.step !== "pre_turn");
    }

    // ------------------------------------------------------------------
    // Ergonomic shortcuts — string-first, no envelopes, the 80% case
    // ------------------------------------------------------------------

    /**
     * Pre-turn recall in one call. Returns the rendered prompt block
     * directly (or `null` if no relevant memories).
     *
     *   const block = await sdk.memory.recall(
     *     "what's my favourite color?",
     *     { agentWallet, userAddress },
     *   );
     */
    async recall(query: string, options: MemoryShorthandOptions): Promise<{
        prompt: string | null;
        items: AgentMemoryContextResponse["items"];
        totals: Record<string, number>;
        contextUsage: AgentMemoryContextResponse["contextUsage"];
    }> {
        const response = await this.context({
            query,
            agentWallet: options.agentWallet,
            userAddress: options.userAddress,
            threadId: options.threadId,
            scope: options.scope,
            haiId: options.haiId,
            limit: options.limit,
            ...(options.budgetCharacters ? { budget: { maxCharacters: options.budgetCharacters } } : {}),
        }, options.request ?? {});
        return {
            prompt: response.prompt,
            items: response.items,
            totals: response.totals,
            contextUsage: response.contextUsage,
        };
    }

    /**
     * Save a durable fact in one call. Returns whether it landed.
     *
     *   await sdk.memory.save(
     *     "my favourite color is azure",
     *     { agentWallet, userAddress, type: "preference" },
     *   );
     */
    async save(content: string, options: MemoryShorthandOptions): Promise<{
        saved: boolean;
        id?: string;
    }> {
        const response = await this.remember({
            content,
            agentWallet: options.agentWallet,
            userAddress: options.userAddress,
            threadId: options.threadId,
            scope: options.scope,
            haiId: options.haiId,
            ...(options.type ? { type: options.type } : {}),
            ...(typeof options.confidence === "number" ? { confidence: options.confidence } : {}),
        }, options.request ?? {});
        return {
            saved: Boolean(response.success),
            id: response.vectorId ?? response.memory?.id,
        };
    }

    // ------------------------------------------------------------------
    // Power-user surface (full layered search, item CRUD, jobs, schedules)
    // ------------------------------------------------------------------

    search(params: LayeredSearchParams, options: MemoryRequestOptions = {}): APIPromise<LayeredSearchResult> {
        return this.request("POST", "/api/memory/items/search", params, options);
    }

    getItem(id: string, params: MemoryItemQuery = {}, options: MemoryRequestOptions = {}): APIPromise<{ item: MemoryVector }> {
        return this.request("GET", `/api/memory/items/${encodeURIComponent(id)}`, undefined, options, {
            agentWallet: params.agentWallet,
            userAddress: params.userAddress,
        });
    }

    updateItem(id: string, params: MemoryItemUpdateParams, options: MemoryRequestOptions = {}): APIPromise<{ updated: boolean; item: MemoryVector }> {
        return this.request("PATCH", `/api/memory/items/${encodeURIComponent(id)}`, params, options, undefined, true);
    }

    deleteItem(id: string, params: MemoryItemDeleteParams = {}, options: MemoryRequestOptions = {}): APIPromise<{ deleted: boolean; hardDeleted: boolean }> {
        return this.request("DELETE", `/api/memory/items/${encodeURIComponent(id)}`, undefined, options, {
            agentWallet: params.agentWallet,
            userAddress: params.userAddress,
            hardDelete: params.hardDelete,
        }, true);
    }

    resolveConflict(
        id: string,
        params: { agentWallet?: string; resolution: "supersede" | "keep" | "merge" | "ignore"; winningMemoryId?: string; reason?: string },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ resolved: boolean; memoryId: string }> {
        return this.request("POST", `/api/memory/conflicts/${encodeURIComponent(id)}/resolve`, params, options, undefined, true);
    }

    createJob(params: MemoryJobCreateParams, options: MemoryRequestOptions = {}): APIPromise<MemoryJobRecord> {
        return this.request("POST", "/api/memory/jobs", params, options, undefined, true);
    }

    getJob(jobId: string, options: MemoryRequestOptions = {}): APIPromise<MemoryJobRecord> {
        return this.request("GET", `/api/memory/jobs/${encodeURIComponent(jobId)}`, undefined, options);
    }

    runEval(params: MemoryEvalRunParams, options: MemoryRequestOptions = {}): APIPromise<MemoryEvalRunResponse> {
        return this.request("POST", "/api/memory/evals/runs", params, options);
    }

    listLoops(options: MemoryRequestOptions = {}): APIPromise<{ loops: MemoryLoopManifest[] }> {
        return this.request("GET", "/api/memory/loops", undefined, options);
    }

    getLoop(loopId: string, options: MemoryRequestOptions = {}): APIPromise<{ loop: MemoryLoopManifest }> {
        return this.request("GET", `/api/memory/loops/${encodeURIComponent(loopId)}`, undefined, options);
    }

    listPatterns(
        params: { agentWallet?: string; patternType?: ProceduralPattern["patternType"]; minSuccessRate?: number; limit?: number } = {},
        options: MemoryRequestOptions = {},
    ): APIPromise<{ patterns: ProceduralPattern[] }> {
        return this.request("GET", "/api/memory/patterns", undefined, options, {
            agentWallet: params.agentWallet,
            patternType: params.patternType,
            minSuccessRate: params.minSuccessRate,
            limit: params.limit,
        });
    }

    getPattern(
        patternId: string,
        params: { agentWallet?: string } = {},
        options: MemoryRequestOptions = {},
    ): APIPromise<{ pattern: ProceduralPattern }> {
        return this.request("GET", `/api/memory/patterns/${encodeURIComponent(patternId)}`, undefined, options, {
            agentWallet: params.agentWallet,
        });
    }

    validatePattern(patternId: string, options: MemoryRequestOptions = {}): APIPromise<MemoryPatternValidation> {
        return this.request("POST", `/api/memory/patterns/${encodeURIComponent(patternId)}/validate`, {}, options);
    }

    promotePattern(
        patternId: string,
        params: { skillName: string; validationData: MemoryPatternValidation },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ skillId: string; promoted: boolean }> {
        return this.request("POST", `/api/memory/patterns/${encodeURIComponent(patternId)}/promote`, params, options, undefined, true);
    }

    listSkills(
        params: { agentWallet?: string; category?: string; limit?: number } = {},
        options: MemoryRequestOptions = {},
    ): APIPromise<{ skills: LearnedSkill[] }> {
        return this.request("GET", "/api/memory/skills", undefined, options, {
            agentWallet: params.agentWallet,
            category: params.category,
            limit: params.limit,
        });
    }

    getSkill(
        skillId: string,
        params: { agentWallet?: string } = {},
        options: MemoryRequestOptions = {},
    ): APIPromise<{ skill: LearnedSkill }> {
        return this.request("GET", `/api/memory/skills/${encodeURIComponent(skillId)}`, undefined, options, {
            agentWallet: params.agentWallet,
        });
    }

    indexTranscript(
        params: {
            sessionId: string;
            threadId: string;
            agentWallet: string;
            userAddress?: string;
            scope?: "global" | "local";
            haiId?: string;
            messages: AgentMemoryRecordTurnParams["messages"];
            modelUsed?: string;
            model?: string;
            totalTokens?: number;
            tokenCount?: number;
            rememberWorkingMemory?: boolean;
        },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ indexed: boolean; messageCount: number; vectorCount: number }> {
        return this.request("POST", "/api/memory/transcripts/index", params, options, undefined, true);
    }

    getWorkingSession(
        sessionId: string,
        params: { agentWallet: string },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ session: SessionMemory }> {
        return this.request("GET", `/api/memory/sessions/${encodeURIComponent(sessionId)}/working`, undefined, options, {
            agentWallet: params.agentWallet,
        });
    }

    updateWorkingSession(
        sessionId: string,
        params: {
            agentWallet: string;
            userAddress?: string;
            threadId?: string;
            scope?: "global" | "local";
            haiId?: string;
            context?: string[];
            entities?: Record<string, unknown>;
            state?: Record<string, unknown>;
            metadata?: Record<string, unknown>;
            replace?: boolean;
        },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ success: boolean; session: SessionMemory }> {
        return this.request("PATCH", `/api/memory/sessions/${encodeURIComponent(sessionId)}/working`, params, options, undefined, true);
    }

    compressSession(
        sessionId: string,
        params: { agentWallet: string; coordinatorModel: string },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ summary: string; entitiesExtracted: number }> {
        return this.request("POST", `/api/memory/sessions/${encodeURIComponent(sessionId)}/compress`, params, options, undefined, true);
    }

    syncArchive(
        archiveId: string,
        params: { agentWallet: string },
        options: MemoryRequestOptions = {},
    ): APIPromise<{ ipfsHash: string; pinned: boolean }> {
        return this.request("POST", `/api/memory/archives/${encodeURIComponent(archiveId)}/sync`, params, options, undefined, true);
    }

    listSchedules(options: MemoryRequestOptions = {}): APIPromise<{ schedules: MemoryScheduleStatus[] }> {
        return this.request("GET", "/api/memory/schedules", undefined, options);
    }

    createSchedules(params: { agentWallets: string[] }, options: MemoryRequestOptions = {}): APIPromise<{ created: boolean }> {
        return this.request("POST", "/api/memory/schedules", params, options, undefined, true);
    }

    deleteSchedules(options: MemoryRequestOptions = {}): APIPromise<{ deleted: boolean }> {
        return this.request("DELETE", "/api/memory/schedules", undefined, options, undefined, true);
    }

    pauseSchedule(scheduleId: string, options: MemoryRequestOptions = {}): APIPromise<{ paused: boolean }> {
        return this.request("POST", `/api/memory/schedules/${encodeURIComponent(scheduleId)}/pause`, {}, options, undefined, true);
    }

    resumeSchedule(scheduleId: string, options: MemoryRequestOptions = {}): APIPromise<{ resumed: boolean }> {
        return this.request("POST", `/api/memory/schedules/${encodeURIComponent(scheduleId)}/resume`, {}, options, undefined, true);
    }

    triggerSchedule(scheduleId: string, options: MemoryRequestOptions = {}): APIPromise<{ triggered: boolean }> {
        return this.request("POST", `/api/memory/schedules/${encodeURIComponent(scheduleId)}/trigger`, {}, options, undefined, true);
    }

    private request<T>(
        method: RequestOptions["method"],
        path: string,
        body: unknown,
        options: MemoryRequestOptions,
        query?: RequestOptions["query"],
        doNotRetry = false,
    ): APIPromise<T> {
        const wallet = this.ctx.getWalletMaybe();
        const token = this.ctx.getTokenMaybe();
        validateMemoryScopePayload(body);

        return this.client.request<T>({
            method,
            path,
            query,
            body,
            signal: options.signal,
            timeoutMs: options.timeoutMs,
            headers: {
                composeKey: token ?? undefined,
                userAddress: wallet.address ?? undefined,
                chainId: wallet.chainId ?? undefined,
                idempotencyKey: options.idempotencyKey,
            },
            doNotRetry,
        });
    }
}

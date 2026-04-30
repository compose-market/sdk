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
    MemoryWorkflowManifest,
    ProceduralPattern,
    SessionMemory,
} from "../types/index.js";

export interface MemoryResourceContext {
    getWalletMaybe: () => { address: string | null; chainId: number | null };
    getTokenMaybe: () => string | null;
}

export interface MemoryRequestOptions {
    signal?: AbortSignal;
    timeoutMs?: number;
    idempotencyKey?: string;
}

export class MemoryResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: MemoryResourceContext,
    ) { }

    context(params: AgentMemoryContextParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryContextResponse> {
        return this.request("POST", "/api/memory/context/assemble", params, options);
    }

    recordTurn(params: AgentMemoryRecordTurnParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryRecordTurnResponse> {
        return this.request("POST", "/api/memory/turns/record", params, options, undefined, true);
    }

    remember(params: AgentMemoryRememberParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryRememberResponse> {
        return this.request("POST", "/api/memory/remember", params, options, undefined, true);
    }

    loop(params: AgentMemoryLoopParams, options: MemoryRequestOptions = {}): APIPromise<AgentMemoryLoopResponse> {
        return this.request("POST", "/api/memory/loop", params, options, undefined, params.step !== "pre_turn");
    }

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

    listWorkflows(options: MemoryRequestOptions = {}): APIPromise<{ workflows: MemoryWorkflowManifest[] }> {
        return this.request("GET", "/api/memory/workflows", undefined, options);
    }

    getWorkflow(workflowId: string, options: MemoryRequestOptions = {}): APIPromise<{ workflow: MemoryWorkflowManifest }> {
        return this.request("GET", `/api/memory/workflows/${encodeURIComponent(workflowId)}`, undefined, options);
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
            mode?: "global" | "local";
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
            mode?: "global" | "local";
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

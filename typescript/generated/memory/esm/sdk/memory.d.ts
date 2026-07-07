import { ClientSDK, RequestOptions } from "../lib/sdks.js";
import * as models from "../models/index.js";
import * as operations from "../models/operations/index.js";
export declare class Memory extends ClientSDK {
    /**
     * Assemble compact pre-turn memory context.
     *
     * @remarks
     * Agent-first memory loop step. Call before reasoning or tool use. Returns a
     * compact prompt and structured memory items across working, scene, graph,
     * patterns, archives, and vectors.
     */
    contextAssemble(request: models.AgentMemoryContextRequest, options?: RequestOptions): Promise<models.AgentMemoryContextResponse>;
    /**
     * Persist the completed turn.
     *
     * @remarks
     * Agent-first memory loop step. Call after the assistant final answer to store
     * transcript, working memory, and vector memory for later retrieval.
     */
    turnRecord(request: models.AgentMemoryRecordTurnRequest, options?: RequestOptions): Promise<models.AgentMemoryRecordTurnResponse>;
    /**
     * Save an explicit durable fact or preference.
     *
     * @remarks
     * Agent-first memory loop step. Call when the agent identifies a durable fact,
     * preference, correction, decision, or operational lesson.
     */
    remember(request: models.AgentMemoryRememberRequest, options?: RequestOptions): Promise<models.AgentMemoryRememberResponse>;
    /**
     * Single endpoint for the agent memory loop.
     *
     * @remarks
     * Minimal-token agent surface. Set `step` to `pre_turn`, `post_turn`, or
     * `remember`; each response returns the next valid loop steps.
     */
    loop(request: models.AgentMemoryLoopRequest, options?: RequestOptions): Promise<operations.LoopResponse>;
    /**
     * List compact agent-first memory loop manifests.
     */
    loopsList(options?: RequestOptions): Promise<models.MemoryLoopListResponse>;
    /**
     * Fetch one compact memory loop manifest.
     */
    loopsGet(request: operations.LoopsGetRequest, options?: RequestOptions): Promise<models.MemoryLoopResponse>;
    /**
     * List learned procedural memory patterns.
     */
    patternsList(request?: operations.PatternsListRequest | undefined, options?: RequestOptions): Promise<models.ProceduralPatternListResponse>;
    /**
     * Fetch one procedural memory pattern.
     */
    patternsGet(request: operations.PatternsGetRequest, options?: RequestOptions): Promise<models.ProceduralPatternResponse>;
    /**
     * Validate a procedural memory pattern before promotion.
     */
    patternsValidate(request: operations.PatternsValidateRequest, options?: RequestOptions): Promise<models.MemoryPatternValidation>;
    /**
     * Promote a validated procedural pattern into a learned skill.
     */
    patternsPromote(request: operations.PatternsPromoteRequest, options?: RequestOptions): Promise<models.MemoryPatternPromoteResponse>;
    /**
     * List learned memory skills.
     */
    skillsList(request?: operations.SkillsListRequest | undefined, options?: RequestOptions): Promise<models.LearnedSkillListResponse>;
    /**
     * Fetch one learned memory skill.
     */
    skillsGet(request: operations.SkillsGetRequest, options?: RequestOptions): Promise<models.LearnedSkillResponse>;
    /**
     * Add graph memory through the configured graph provider.
     */
    graphAdd(request: models.MemoryAddRequest, options?: RequestOptions): Promise<Array<models.GraphMemoryItem>>;
    /**
     * Search graph memory through the configured graph provider.
     */
    graphSearch(request: models.MemorySearchRequest, options?: RequestOptions): Promise<Array<models.GraphMemoryItem>>;
    /**
     * List memories for an agent wallet.
     */
    list(request: operations.ListRequest, options?: RequestOptions): Promise<Array<models.GraphMemoryItem>>;
    /**
     * Search vector memory.
     */
    vectorSearch(request: models.VectorSearchRequest, options?: RequestOptions): Promise<models.VectorSearchResponse>;
    /**
     * Index a memory vector.
     */
    vectorIndex(request: models.VectorIndexRequest, options?: RequestOptions): Promise<models.VectorIndexResponse>;
    /**
     * Store a session transcript.
     */
    transcriptStore(request: models.TranscriptStoreRequest, options?: RequestOptions): Promise<models.SuccessResponse>;
    /**
     * Fetch a transcript by session or thread id.
     */
    transcriptGet(request: operations.TranscriptGetRequest, options?: RequestOptions): Promise<models.SessionTranscript>;
    /**
     * Store, index, and optionally update working memory from a transcript.
     */
    transcriptsIndex(request: models.TranscriptIndexRequest, options?: RequestOptions): Promise<models.TranscriptIndexResponse>;
    /**
     * Fetch hot working memory for a session.
     */
    sessionsWorkingGet(request: operations.SessionsWorkingGetRequest, options?: RequestOptions): Promise<models.SessionMemoryResponse>;
    /**
     * Update hot working memory for a session.
     */
    sessionsWorkingUpdate(request: operations.SessionsWorkingUpdateRequest, options?: RequestOptions): Promise<models.WorkingSessionUpdateResponse>;
    /**
     * Compress a long transcript into durable archive memory.
     */
    sessionsCompress(request: operations.SessionsCompressRequest, options?: RequestOptions): Promise<models.SessionCompressResponse>;
    /**
     * Sync a memory archive to durable external storage.
     */
    archivesSync(request: operations.ArchivesSyncRequest, options?: RequestOptions): Promise<models.ArchiveSyncResponse>;
    /**
     * List Temporal memory schedule status.
     */
    schedulesList(request?: operations.SchedulesListRequest | undefined, options?: RequestOptions): Promise<models.MemoryScheduleListResponse>;
    /**
     * Create or replace memory maintenance schedules.
     */
    schedulesCreate(request: models.MemoryScheduleCreateRequest, options?: RequestOptions): Promise<models.MemoryScheduleCreateResponse>;
    /**
     * Delete memory maintenance schedules.
     */
    schedulesDelete(request?: operations.SchedulesDeleteRequest | undefined, options?: RequestOptions): Promise<models.MemoryScheduleDeleteResponse>;
    /**
     * Pause one memory maintenance schedule.
     */
    schedulesPause(request: operations.SchedulesPauseRequest, options?: RequestOptions): Promise<models.MemorySchedulePauseResponse>;
    /**
     * Resume one memory maintenance schedule.
     */
    schedulesResume(request: operations.SchedulesResumeRequest, options?: RequestOptions): Promise<models.MemoryScheduleResumeResponse>;
    /**
     * Trigger one memory maintenance schedule immediately.
     */
    schedulesTrigger(request: operations.SchedulesTriggerRequest, options?: RequestOptions): Promise<models.MemoryScheduleTriggerResponse>;
    /**
     * Rerank candidate memory documents.
     */
    rerank(request: operations.RerankRequest, options?: RequestOptions): Promise<models.RerankResponse>;
    /**
     * Search all memory layers.
     */
    layersSearch(request: models.MemorySearchRequest, options?: RequestOptions): Promise<models.LayeredSearchResponse>;
    /**
     * Get memory statistics for an agent wallet.
     */
    statsGet(request: operations.StatsGetRequest, options?: RequestOptions): Promise<models.MemoryStatsResponse>;
    /**
     * Search productized memory items across layers.
     */
    itemsSearch(request: models.MemorySearchRequest, options?: RequestOptions): Promise<models.LayeredSearchResponse>;
    /**
     * Fetch one durable memory item.
     */
    itemsGet(request: operations.ItemsGetRequest, options?: RequestOptions): Promise<models.MemoryItemResponse>;
    /**
     * Update one durable memory item.
     */
    itemsUpdate(request: operations.ItemsUpdateRequest, options?: RequestOptions): Promise<models.MemoryItemUpdateResponse>;
    /**
     * Delete or soft-delete one durable memory item.
     */
    itemsDelete(request: operations.ItemsDeleteRequest, options?: RequestOptions): Promise<models.MemoryItemDeleteResponse>;
    /**
     * Resolve a memory conflict.
     */
    conflictsResolve(request: operations.ConflictsResolveRequest, options?: RequestOptions): Promise<models.MemoryConflictResolveResponse>;
    /**
     * Run a memory maintenance job.
     */
    jobsCreate(request: models.MemoryJobCreateRequest, options?: RequestOptions): Promise<models.MemoryJobRecord>;
    /**
     * Fetch a memory maintenance job.
     */
    jobsGet(request: operations.JobsGetRequest, options?: RequestOptions): Promise<models.MemoryJobRecord>;
    /**
     * Run a memory retrieval evaluation.
     */
    evalsRun(request: models.MemoryEvalRunRequest, options?: RequestOptions): Promise<models.MemoryEvalRunResponse>;
}
//# sourceMappingURL=memory.d.ts.map
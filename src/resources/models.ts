import type { APIPromise, HttpClient } from "../http.js";
import type {
    CanonicalModality,
    ModalityCatalogEntry,
    ModalityListResponse,
    Model,
    ModelListResponse,
    OperationListResponse,
    OperationModelsInput,
    OperationModelsResponse,
    ModelParamsResponse,
    ModelSearchInput,
    ModelSearchResponse,
} from "../types/index.js";

export class ModelModalitiesResource {
    constructor(private readonly client: HttpClient) {}

    /**
     * Canonical modality catalog derived from the model registry source of
     * truth: model type, input/output shapes, and pricing unit metadata.
     */
    list(): APIPromise<ModalityListResponse> {
        return this.client.request<ModalityListResponse>({
            method: "GET",
            path: "/v1/modalities",
        });
    }

    get(modality: CanonicalModality): APIPromise<ModalityCatalogEntry> {
        return this.client.request<ModalityCatalogEntry>({
            method: "GET",
            path: `/v1/modalities/${encodeURIComponent(modality)}`,
        });
    }

    operations(modality: CanonicalModality): APIPromise<OperationListResponse> {
        return this.client.request<OperationListResponse>({
            method: "GET",
            path: `/v1/modalities/${encodeURIComponent(modality)}/operations`,
        });
    }

    models(
        modality: CanonicalModality,
        operation: string,
        input: OperationModelsInput = {},
    ): APIPromise<OperationModelsResponse> {
        const query: Record<string, string | number | boolean | null | undefined> = { ...input };
        return this.client.request<OperationModelsResponse>({
            method: "GET",
            path: `/v1/modalities/${encodeURIComponent(modality)}/operations/${encodeURIComponent(operation)}/models`,
            query,
        });
    }
}

export class ModelsResource {
    readonly modalities: ModelModalitiesResource;

    constructor(private readonly client: HttpClient) {
        this.modalities = new ModelModalitiesResource(client);
    }

    /**
     * List the curated ~612-model set. Use `listAll()` for the 45k+ catalog.
     * Returns the canonical OpenAI-compatible `Model` shape.
     */
    list(): APIPromise<ModelListResponse> {
        return this.client.request<ModelListResponse>({
            method: "GET",
            path: "/v1/models",
        });
    }

    /**
     * Full catalog — ~45k+ models across 12 providers. Recommended to pair
     * with `search()` for discoverability; raw `listAll()` is intended for
     * exports and power users.
     */
    listAll(): APIPromise<ModelListResponse> {
        return this.client.request<ModelListResponse>({
            method: "GET",
            path: "/v1/models/all",
        });
    }

    /**
     * Cursor-paginated search across the full catalog with filters for
     * modality, operation, provider, price ceiling, context window minimum, and
     * streaming support.
     */
    search(input: ModelSearchInput = {}): APIPromise<ModelSearchResponse> {
        return this.client.request<ModelSearchResponse>({
            method: "POST",
            path: "/v1/models/search",
            body: input,
        });
    }

    get(modelId: string): APIPromise<Model> {
        return this.client.request<Model>({
            method: "GET",
            path: `/v1/models/${encodeURIComponent(modelId)}`,
        });
    }

    getParams(modelId: string): APIPromise<ModelParamsResponse> {
        return this.client.request<ModelParamsResponse>({
            method: "GET",
            path: `/v1/models/${encodeURIComponent(modelId)}/params`,
        });
    }
}

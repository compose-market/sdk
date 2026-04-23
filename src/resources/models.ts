import type { APIPromise, HttpClient } from "../http.js";
import type {
    Model,
    ModelListResponse,
    ModelParamsResponse,
    ModelSearchInput,
    ModelSearchResponse,
} from "../types/index.js";

export class ModelsResource {
    constructor(private readonly client: HttpClient) {}

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
     * modality, provider, price ceiling, context window minimum, and
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

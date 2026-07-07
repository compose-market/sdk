import type { APIPromise, HttpClient } from "../http.js";
import type { FrameworksResponse, HealthResponse } from "../types/index.js";

export class SystemResource {
    constructor(private readonly client: HttpClient) {}

    health(): APIPromise<HealthResponse> {
        return this.client.request<HealthResponse>({
            method: "GET",
            path: "/health",
        });
    }

    frameworks(): APIPromise<FrameworksResponse> {
        return this.client.request<FrameworksResponse>({
            method: "GET",
            path: "/frameworks",
        });
    }
}

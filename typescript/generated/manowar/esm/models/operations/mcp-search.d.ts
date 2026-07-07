import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP semantic search.
 */
export declare const McpSearchServerConnectors = "connectors";
export declare const McpSearchServerList: {
    connectors: string;
};
export type McpSearchRequest = {
    q: string;
    limit?: number | undefined;
};
/** @internal */
export type McpSearchRequest$Outbound = {
    q: string;
    limit?: number | undefined;
};
/** @internal */
export declare const McpSearchRequest$outboundSchema: z.ZodMiniType<McpSearchRequest$Outbound, McpSearchRequest>;
export declare function mcpSearchRequestToJSON(mcpSearchRequest: McpSearchRequest): string;
//# sourceMappingURL=mcp-search.d.ts.map
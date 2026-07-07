import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP catalog.
 */
export declare const McpListServerConnectors = "connectors";
export declare const McpListServerList: {
    connectors: string;
};
export type McpListRequest = {
    limit?: number | undefined;
    offset?: number | undefined;
    category?: string | undefined;
    status?: string | undefined;
};
/** @internal */
export type McpListRequest$Outbound = {
    limit?: number | undefined;
    offset?: number | undefined;
    category?: string | undefined;
    status?: string | undefined;
};
/** @internal */
export declare const McpListRequest$outboundSchema: z.ZodMiniType<McpListRequest$Outbound, McpListRequest>;
export declare function mcpListRequestToJSON(mcpListRequest: McpListRequest): string;
//# sourceMappingURL=mcp-list.d.ts.map
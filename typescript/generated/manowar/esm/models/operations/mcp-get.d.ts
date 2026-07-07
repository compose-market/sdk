import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP server card.
 */
export declare const McpGetServerConnectors = "connectors";
export declare const McpGetServerList: {
    connectors: string;
};
export type McpGetRequest = {
    serverId: string;
};
/** @internal */
export type McpGetRequest$Outbound = {
    serverId: string;
};
/** @internal */
export declare const McpGetRequest$outboundSchema: z.ZodMiniType<McpGetRequest$Outbound, McpGetRequest>;
export declare function mcpGetRequestToJSON(mcpGetRequest: McpGetRequest): string;
//# sourceMappingURL=mcp-get.d.ts.map
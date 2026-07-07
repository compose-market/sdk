import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP action listing.
 */
export declare const McpActionsListServerConnectors = "connectors";
export declare const McpActionsListServerList: {
    connectors: string;
};
export type McpActionsListRequest = {
    serverId: string;
};
/** @internal */
export type McpActionsListRequest$Outbound = {
    serverId: string;
};
/** @internal */
export declare const McpActionsListRequest$outboundSchema: z.ZodMiniType<McpActionsListRequest$Outbound, McpActionsListRequest>;
export declare function mcpActionsListRequestToJSON(mcpActionsListRequest: McpActionsListRequest): string;
//# sourceMappingURL=mcp-actions-list.d.ts.map
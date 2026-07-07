import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP spawn config.
 */
export declare const McpSpawnGetServerConnectors = "connectors";
export declare const McpSpawnGetServerList: {
    connectors: string;
};
export type McpSpawnGetRequest = {
    serverId: string;
};
/** @internal */
export type McpSpawnGetRequest$Outbound = {
    serverId: string;
};
/** @internal */
export declare const McpSpawnGetRequest$outboundSchema: z.ZodMiniType<McpSpawnGetRequest$Outbound, McpSpawnGetRequest>;
export declare function mcpSpawnGetRequestToJSON(mcpSpawnGetRequest: McpSpawnGetRequest): string;
//# sourceMappingURL=mcp-spawn-get.d.ts.map
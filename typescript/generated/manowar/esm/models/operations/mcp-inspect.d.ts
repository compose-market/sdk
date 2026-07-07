import * as z from "zod/v4-mini";
/**
 * Production connectors Worker MCP candidate inspection.
 */
export declare const McpInspectServerConnectors = "connectors";
export declare const McpInspectServerList: {
    connectors: string;
};
export type McpInspectRequestBody = {
    candidates: Array<{
        [k: string]: any;
    }>;
    deadlineMs?: number | undefined;
};
export type McpInspectRequest = {
    serverId: string;
    body: McpInspectRequestBody;
};
/** @internal */
export type McpInspectRequestBody$Outbound = {
    candidates: Array<{
        [k: string]: any;
    }>;
    deadlineMs?: number | undefined;
};
/** @internal */
export declare const McpInspectRequestBody$outboundSchema: z.ZodMiniType<McpInspectRequestBody$Outbound, McpInspectRequestBody>;
export declare function mcpInspectRequestBodyToJSON(mcpInspectRequestBody: McpInspectRequestBody): string;
/** @internal */
export type McpInspectRequest$Outbound = {
    serverId: string;
    body: McpInspectRequestBody$Outbound;
};
/** @internal */
export declare const McpInspectRequest$outboundSchema: z.ZodMiniType<McpInspectRequest$Outbound, McpInspectRequest>;
export declare function mcpInspectRequestToJSON(mcpInspectRequest: McpInspectRequest): string;
//# sourceMappingURL=mcp-inspect.d.ts.map
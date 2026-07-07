import * as z from "zod/v4-mini";
import * as models from "../index.js";
/**
 * Production connectors Worker MCP action execution.
 */
export declare const McpActionExecuteServerConnectors = "connectors";
export declare const McpActionExecuteServerList: {
    connectors: string;
};
export type McpActionExecuteRequest = {
    serverId: string;
    command: string;
    body: models.ActionExecuteRequest;
};
/** @internal */
export type McpActionExecuteRequest$Outbound = {
    serverId: string;
    command: string;
    body: models.ActionExecuteRequest$Outbound;
};
/** @internal */
export declare const McpActionExecuteRequest$outboundSchema: z.ZodMiniType<McpActionExecuteRequest$Outbound, McpActionExecuteRequest>;
export declare function mcpActionExecuteRequestToJSON(mcpActionExecuteRequest: McpActionExecuteRequest): string;
//# sourceMappingURL=mcp-action-execute.d.ts.map
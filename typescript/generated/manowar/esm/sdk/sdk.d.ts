import { ClientSDK } from "../lib/sdks.js";
import { Agents } from "./agents.js";
import { Connectors } from "./connectors.js";
import { Workflows } from "./workflows.js";
import { Workspace } from "./workspace.js";
export declare class SDK extends ClientSDK {
    private _agents?;
    get agents(): Agents;
    private _workflows?;
    get workflows(): Workflows;
    private _workspace?;
    get workspace(): Workspace;
    private _connectors?;
    get connectors(): Connectors;
}
//# sourceMappingURL=sdk.d.ts.map
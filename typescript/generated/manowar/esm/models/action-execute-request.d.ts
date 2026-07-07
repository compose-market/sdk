import * as z from "zod/v4-mini";
export type ActionExecuteRequest = {
    args?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export type ActionExecuteRequest$Outbound = {
    args?: {
        [k: string]: any;
    } | undefined;
};
/** @internal */
export declare const ActionExecuteRequest$outboundSchema: z.ZodMiniType<ActionExecuteRequest$Outbound, ActionExecuteRequest>;
export declare function actionExecuteRequestToJSON(actionExecuteRequest: ActionExecuteRequest): string;
//# sourceMappingURL=action-execute-request.d.ts.map
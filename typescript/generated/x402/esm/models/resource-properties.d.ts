import * as z from "zod/v4-mini";
export type ResourceProperties = {
    url: string;
    description?: string | undefined;
    mimeType?: string | undefined;
};
/** @internal */
export type ResourceProperties$Outbound = {
    url: string;
    description?: string | undefined;
    mimeType?: string | undefined;
};
/** @internal */
export declare const ResourceProperties$outboundSchema: z.ZodMiniType<ResourceProperties$Outbound, ResourceProperties>;
export declare function resourcePropertiesToJSON(resourceProperties: ResourceProperties): string;
//# sourceMappingURL=resource-properties.d.ts.map
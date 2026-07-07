import * as z from "zod/v4-mini";
export type LineItem = {
    key: string;
    unit: string;
    quantity: number;
    unitPriceUsd: number;
};
export type MeteredInput = {
    subject: string;
    lineItems: Array<LineItem>;
};
/** @internal */
export type LineItem$Outbound = {
    key: string;
    unit: string;
    quantity: number;
    unitPriceUsd: number;
};
/** @internal */
export declare const LineItem$outboundSchema: z.ZodMiniType<LineItem$Outbound, LineItem>;
export declare function lineItemToJSON(lineItem: LineItem): string;
/** @internal */
export type MeteredInput$Outbound = {
    subject: string;
    lineItems: Array<LineItem$Outbound>;
};
/** @internal */
export declare const MeteredInput$outboundSchema: z.ZodMiniType<MeteredInput$Outbound, MeteredInput>;
export declare function meteredInputToJSON(meteredInput: MeteredInput): string;
//# sourceMappingURL=metered-input.d.ts.map
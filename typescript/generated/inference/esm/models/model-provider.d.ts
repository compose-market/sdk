import * as z from "zod/v4-mini";
import { OpenEnum } from "../types/enums.js";
export declare const ModelProvider: {
    readonly Gemini: "gemini";
    readonly Openai: "openai";
    readonly Fireworks: "fireworks";
    readonly Deepinfra: "deepinfra";
    readonly Asicloud: "asicloud";
    readonly Alibaba: "alibaba";
    readonly HuggingFace: "hugging face";
    readonly Azure: "azure";
    readonly Aiml: "aiml";
    readonly Vertex: "vertex";
    readonly Cloudflare: "cloudflare";
    readonly Deepgram: "deepgram";
    readonly Elevenlabs: "elevenlabs";
    readonly Cartesia: "cartesia";
    readonly Roboflow: "roboflow";
};
export type ModelProvider = OpenEnum<typeof ModelProvider>;
/** @internal */
export declare const ModelProvider$inboundSchema: z.ZodMiniType<ModelProvider, unknown>;
/** @internal */
export declare const ModelProvider$outboundSchema: z.ZodMiniType<string, ModelProvider>;
//# sourceMappingURL=model-provider.d.ts.map
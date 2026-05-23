import type { APIPromise, HttpClient } from "../http.js";
import { BadRequestError } from "../errors.js";
import type {
    FeedbackContext,
    FeedbackListResponse,
    FeedbackSubmitInput,
    FeedbackSubmitResponse,
    FeedbackSummary,
    FeedbackTarget,
    FeedbackTargetType,
} from "../types/index.js";
import { SDK_VERSION } from "../version.js";

type FeedbackWithoutTarget = Omit<FeedbackSubmitInput, "target">;

const TARGET_TYPES: readonly FeedbackTargetType[] = ["endpoint", "x402", "model", "agent", "workflow"];

function assertTarget(target: FeedbackTarget): FeedbackTarget {
    if (!target || !TARGET_TYPES.includes(target.type)) {
        throw new BadRequestError({ message: "feedback target.type must be endpoint, x402, model, agent, or workflow" });
    }
    if (typeof target.id !== "string" || target.id.trim().length === 0) {
        throw new BadRequestError({ message: "feedback target.id is required" });
    }
    return { type: target.type, id: target.id.trim() };
}

function mergeContext(input: FeedbackSubmitInput, wallet: { chainId: number | null }): FeedbackSubmitInput {
    const context: FeedbackContext = {
        ...(input.context ?? {}),
        sdk: {
            name: "@compose-market/sdk",
            version: SDK_VERSION,
            ...(input.context?.sdk ?? {}),
        },
    };

    if (context.chainId === undefined && wallet.chainId !== null) {
        context.chainId = wallet.chainId;
    }

    return {
        ...input,
        target: assertTarget(input.target),
        context,
    };
}

export class FeedbackResource {
    constructor(
        private readonly client: HttpClient,
        private readonly ctx: {
            getWalletMaybe(): { address: string | null; chainId: number | null };
            getTokenMaybe(): string | null;
        },
    ) { }

    /**
     * Submit feedback against a stable Compose target.
     *
     * The SDK attaches the current Compose Key when present. Without a key it
     * still sends the attached wallet headers, so the API can distinguish
     * compose-key, wallet-header, and anonymous feedback.
     */
    submit(input: FeedbackSubmitInput): APIPromise<FeedbackSubmitResponse> {
        const wallet = this.ctx.getWalletMaybe();
        const body = mergeContext(input, wallet);
        const token = this.ctx.getTokenMaybe();

        return this.client.request<FeedbackSubmitResponse>({
            method: "POST",
            path: "/v1/feedback",
            body,
            headers: {
                composeKey: token ?? undefined,
                userAddress: wallet.address ?? undefined,
                chainId: wallet.chainId ?? undefined,
            },
        });
    }

    list(target: FeedbackTarget, opts: { limit?: number } = {}): APIPromise<FeedbackListResponse> {
        const resolved = assertTarget(target);
        return this.client.request<FeedbackListResponse>({
            method: "GET",
            path: "/v1/feedback",
            query: {
                targetType: resolved.type,
                targetId: resolved.id,
                limit: opts.limit,
            },
        });
    }

    summary(target: FeedbackTarget, opts: { recentLimit?: number } = {}): APIPromise<FeedbackSummary> {
        const resolved = assertTarget(target);
        return this.client.request<FeedbackSummary>({
            method: "GET",
            path: "/v1/feedback/summary",
            query: {
                targetType: resolved.type,
                targetId: resolved.id,
                recentLimit: opts.recentLimit,
            },
        });
    }

    model(modelId: string, input: FeedbackWithoutTarget): APIPromise<FeedbackSubmitResponse> {
        return this.submit({
            ...input,
            target: { type: "model", id: modelId },
            context: {
                ...(input.context ?? {}),
                modelId: input.context?.modelId ?? modelId,
            },
        });
    }

    agent(agentWallet: string, input: FeedbackWithoutTarget): APIPromise<FeedbackSubmitResponse> {
        return this.submit({
            ...input,
            target: { type: "agent", id: agentWallet },
            context: {
                ...(input.context ?? {}),
                agentWallet: input.context?.agentWallet ?? agentWallet,
            },
        });
    }

    workflow(workflowId: string, input: FeedbackWithoutTarget): APIPromise<FeedbackSubmitResponse> {
        return this.submit({
            ...input,
            target: { type: "workflow", id: workflowId },
            context: {
                ...(input.context ?? {}),
                workflowId: input.context?.workflowId ?? workflowId,
            },
        });
    }

    x402(targetId: string, input: FeedbackWithoutTarget): APIPromise<FeedbackSubmitResponse> {
        return this.submit({
            ...input,
            target: { type: "x402", id: targetId },
        });
    }

    endpoint(targetId: string, input: FeedbackWithoutTarget): APIPromise<FeedbackSubmitResponse> {
        return this.submit({
            ...input,
            target: { type: "endpoint", id: targetId },
        });
    }
}

/**
 * Shared instrumentation for billable inference responses.
 *
 * Every resource method that produces a `ComposeCompletion<T>` routes through
 * `instrumentResponse(...)` to extract the settlement receipt and the live
 * session-budget snapshot from response headers, emit them on the SDK event
 * bus, and build the public return shape.
 */

import type { ComposeEventBus } from "../events.js";
import type {
    ComposeReceipt,
    SessionBudgetSnapshot,
    SessionInvalidReason,
} from "../types/index.js";
import { extractReceiptFromResponse } from "../streaming/receipt.js";
import { extractSessionBudgetFromResponse } from "../streaming/budget.js";

export interface InstrumentedResult<T> {
    data: T;
    response: Response;
    receipt: ComposeReceipt | null;
    requestId: string | null;
    budget: SessionBudgetSnapshot | null;
    sessionInvalidReason: SessionInvalidReason | null;
}

export interface InferenceContext {
    getWalletMaybe(): { address: string | null; chainId: number | null };
    getTokenMaybe(): string | null;
    events: ComposeEventBus;
}

export function instrumentBillableResponse<T>(
    ctx: InferenceContext,
    response: Response,
    data: T,
): InstrumentedResult<T> {
    const requestId = response.headers.get("x-request-id") ?? response.headers.get("X-Request-Id");
    const receipt = extractReceiptFromResponse(response, data as unknown as Record<string, unknown>);
    const { budget, sessionInvalidReason } = extractSessionBudgetFromResponse(response);
    const walletCtx = ctx.getWalletMaybe();

    if (receipt) {
        ctx.events.emit("receipt", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            receipt,
            requestId,
            source: response.headers.get("x-compose-receipt") ? "response-header" : "body",
        });
    }

    if (budget) {
        ctx.events.emit("budget", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            snapshot: budget,
            requestId,
        });
    }

    if (sessionInvalidReason) {
        ctx.events.emit("sessionInvalid", {
            userAddress: walletCtx.address,
            chainId: walletCtx.chainId,
            reason: sessionInvalidReason,
            requestId,
        });
    }

    return { data, response, receipt, requestId, budget, sessionInvalidReason };
}

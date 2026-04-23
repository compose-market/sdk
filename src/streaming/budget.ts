/**
 * Extract session-budget state from response headers.
 *
 * The api.compose.market gateway emits the live session-budget ledger on every
 * billable response via these headers:
 *   - `x-session-budget-limit`      total budget (wei, string)
 *   - `x-session-budget-used`       spent (wei, string)
 *   - `x-session-budget-locked`     reserved (wei, string)
 *   - `x-session-budget-remaining`  remaining (wei, string)
 *   - `x-compose-session-invalid`   truthy string when the session must be torn
 *                                   down (e.g. "budget-depleted", "expired")
 *
 * This helper converts them into a typed object for the SDK event bus.
 */

import type { SessionBudgetSnapshot, SessionInvalidReason } from "../types/index.js";

export function extractSessionBudgetFromResponse(
    response: { headers: Headers },
): { budget: SessionBudgetSnapshot | null; sessionInvalidReason: SessionInvalidReason | null } {
    const limit = response.headers.get("x-session-budget-limit");
    const used = response.headers.get("x-session-budget-used");
    const locked = response.headers.get("x-session-budget-locked");
    const remaining = response.headers.get("x-session-budget-remaining");

    const invalidRaw = response.headers.get("x-compose-session-invalid");
    const sessionInvalidReason = typeof invalidRaw === "string" && invalidRaw.length > 0
        ? (invalidRaw as SessionInvalidReason)
        : null;

    // Emit the budget snapshot only when at least one numeric header is
    // present. Any non-parseable value falls back to null so downstream
    // consumers see `null` rather than NaN.
    if (limit === null && used === null && locked === null && remaining === null) {
        return { budget: null, sessionInvalidReason };
    }

    return {
        budget: {
            limitWei: limit ?? null,
            usedWei: used ?? null,
            lockedWei: locked ?? null,
            remainingWei: remaining ?? null,
        },
        sessionInvalidReason,
    };
}

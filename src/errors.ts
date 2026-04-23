/**
 * Compose Market SDK — typed error hierarchy.
 *
 * Every error raised by the SDK derives from `ComposeError`. Callers can
 * discriminate via `instanceof` (e.g. `err instanceof ComposePaymentRequiredError`)
 * or via `err.code`, which always matches the canonical server error enum.
 */

import type {
    ComposeErrorCode,
    ComposeReceipt,
    PaymentRequired,
} from "./types/index.js";

export class ComposeError extends Error {
    readonly code: ComposeErrorCode;
    readonly status?: number;
    readonly details?: Record<string, unknown>;
    readonly requestId?: string;
    readonly headers?: Record<string, string>;
    readonly body?: unknown;

    constructor(input: {
        code: ComposeErrorCode;
        message: string;
        status?: number;
        details?: Record<string, unknown>;
        requestId?: string;
        headers?: Record<string, string>;
        body?: unknown;
    }) {
        super(input.message);
        this.name = "ComposeError";
        this.code = input.code;
        this.status = input.status;
        this.details = input.details;
        this.requestId = input.requestId;
        this.headers = input.headers;
        this.body = input.body;
    }
}

export class ComposeAPIError extends ComposeError {
    constructor(input: {
        code: ComposeErrorCode;
        message: string;
        status: number;
        details?: Record<string, unknown>;
        requestId?: string;
        headers?: Record<string, string>;
        body?: unknown;
    }) {
        super(input);
        this.name = "ComposeAPIError";
    }
}

export class BadRequestError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "validation_error", ...input, status: 400 });
        this.name = "BadRequestError";
    }
}

export class AuthenticationError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "authentication_failed", ...input, status: 401 });
        this.name = "AuthenticationError";
    }
}

export class PermissionDeniedError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "forbidden", ...input, status: 403 });
        this.name = "PermissionDeniedError";
    }
}

export class NotFoundError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "not_found", ...input, status: 404 });
        this.name = "NotFoundError";
    }
}

export class ConflictError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "conflict", ...input, status: 409 });
        this.name = "ConflictError";
    }
}

export class UnprocessableEntityError extends ComposeAPIError {
    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & { code?: ComposeErrorCode }) {
        super({ code: input.code ?? "validation_error", ...input, status: 422 });
        this.name = "UnprocessableEntityError";
    }
}

export class RateLimitError extends ComposeAPIError {
    readonly retryAfter?: number;

    constructor(input: Omit<ConstructorParameters<typeof ComposeAPIError>[0], "status" | "code"> & {
        code?: ComposeErrorCode;
        retryAfter?: number;
    }) {
        super({ code: input.code ?? "rate_limited", ...input, status: 429 });
        this.name = "RateLimitError";
        this.retryAfter = input.retryAfter;
    }
}

export class InternalServerError extends ComposeAPIError {
    constructor(input: {
        code?: ComposeErrorCode;
        message: string;
        status?: number;
        details?: Record<string, unknown>;
        requestId?: string;
        headers?: Record<string, string>;
        body?: unknown;
    }) {
        super({ code: input.code ?? "internal_error", status: input.status ?? 500, message: input.message, details: input.details, requestId: input.requestId, headers: input.headers, body: input.body });
        this.name = "InternalServerError";
    }
}

export class ComposePaymentRequiredError extends ComposeAPIError {
    readonly paymentRequired: PaymentRequired | null;
    readonly paymentRequiredHeader: string | null;

    constructor(input: {
        code?: ComposeErrorCode;
        message: string;
        details?: Record<string, unknown>;
        requestId?: string;
        headers?: Record<string, string>;
        body?: unknown;
        paymentRequired: PaymentRequired | null;
        paymentRequiredHeader: string | null;
    }) {
        super({ code: input.code ?? "payment_required", ...input, status: 402 });
        this.name = "ComposePaymentRequiredError";
        this.paymentRequired = input.paymentRequired;
        this.paymentRequiredHeader = input.paymentRequiredHeader;
    }
}

export class ComposeBudgetExhaustedError extends ComposeAPIError {
    constructor(input: {
        message: string;
        details?: Record<string, unknown>;
        requestId?: string;
        headers?: Record<string, string>;
        body?: unknown;
    }) {
        super({ code: "budget_exhausted", ...input, status: 402 });
        this.name = "ComposeBudgetExhaustedError";
    }
}

export class ComposeConnectionError extends ComposeError {
    readonly cause?: unknown;

    constructor(input: { message: string; cause?: unknown; requestId?: string }) {
        super({ code: "network_error", ...input });
        this.name = "ComposeConnectionError";
        this.cause = input.cause;
    }
}

export class ComposeTimeoutError extends ComposeError {
    constructor(input: { message: string; requestId?: string }) {
        super({ code: "timeout", ...input });
        this.name = "ComposeTimeoutError";
    }
}

export interface ComposeCallFailure {
    code: ComposeErrorCode;
    message: string;
    details?: Record<string, unknown>;
    receipt?: ComposeReceipt;
}

/**
 * Internal constructor: build the most specific error from a parsed HTTP
 * response. Used by the HTTP client before the response is handed back to
 * callers.
 */
export function buildApiError(input: {
    status: number;
    code: ComposeErrorCode;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
    headers?: Record<string, string>;
    body?: unknown;
    paymentRequired?: PaymentRequired | null;
    paymentRequiredHeader?: string | null;
    retryAfter?: number;
}): ComposeAPIError {
    const base = {
        code: input.code,
        message: input.message,
        details: input.details,
        requestId: input.requestId,
        headers: input.headers,
        body: input.body,
    };

    if (input.status === 402) {
        if (input.code === "budget_exhausted") {
            return new ComposeBudgetExhaustedError(base);
        }
        return new ComposePaymentRequiredError({
            ...base,
            paymentRequired: input.paymentRequired ?? null,
            paymentRequiredHeader: input.paymentRequiredHeader ?? null,
        });
    }
    if (input.status === 400) return new BadRequestError(base);
    if (input.status === 401) return new AuthenticationError(base);
    if (input.status === 403) return new PermissionDeniedError(base);
    if (input.status === 404) return new NotFoundError(base);
    if (input.status === 409) return new ConflictError(base);
    if (input.status === 422) return new UnprocessableEntityError(base);
    if (input.status === 429) return new RateLimitError({ ...base, retryAfter: input.retryAfter });
    return new InternalServerError({ ...base, status: input.status });
}

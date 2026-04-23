/**
 * Dependency-free SSE parser.
 *
 * Works in Node 20+, Bun, Deno, Cloudflare Workers, and modern browsers.
 * Given a `ReadableStream<Uint8Array>` it yields parsed SSE frames with:
 *   - `event`: the `event:` field (or "message" if omitted)
 *   - `data`:  the joined `data:` lines
 *   - `id`:    the `id:` field if present
 *
 * Compose's named SSE events include `message` (default OpenAI data frames),
 * `compose.receipt`, `compose.error`, `compose.video.status`.
 *
 * The special OpenAI terminator frame `data: [DONE]` short-circuits iteration:
 * it is yielded once with `data === "[DONE]"` and then the stream ends.
 */

export interface SSEFrame {
    event: string;
    data: string;
    id?: string;
}

const ENCODER_EOL = /\r\n|\r|\n/;

function splitLines(buffer: string): { lines: string[]; rest: string } {
    const parts = buffer.split(ENCODER_EOL);
    // The last element might be a partial line; keep it.
    const rest = parts.pop() ?? "";
    return { lines: parts, rest };
}

/**
 * Parse a browser-style ReadableStream of SSE bytes and yield one frame at a
 * time. `signal` can abort the iterator; when aborted, the underlying stream
 * reader is cancelled.
 */
export async function* parseSSEStream(
    stream: ReadableStream<Uint8Array>,
    options: { signal?: AbortSignal } = {},
): AsyncGenerator<SSEFrame, void, void> {
    const reader = stream.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let currentEvent = "message";
    let currentData: string[] = [];
    let currentId: string | undefined;

    const onAbort = () => {
        try { reader.cancel(); } catch { /* best-effort */ }
    };
    options.signal?.addEventListener("abort", onAbort);

    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const { lines, rest } = splitLines(buffer);
            buffer = rest;

            for (const line of lines) {
                if (line === "") {
                    // End of frame. Emit if we have data.
                    if (currentData.length > 0) {
                        yield {
                            event: currentEvent,
                            data: currentData.join("\n"),
                            id: currentId,
                        };
                    }
                    currentEvent = "message";
                    currentData = [];
                    currentId = undefined;
                    continue;
                }

                if (line.startsWith(":")) {
                    // Comment / keep-alive — ignore.
                    continue;
                }

                const colonIndex = line.indexOf(":");
                const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
                let value = colonIndex === -1 ? "" : line.slice(colonIndex + 1);
                if (value.startsWith(" ")) {
                    value = value.slice(1);
                }

                switch (field) {
                    case "event":
                        currentEvent = value || "message";
                        break;
                    case "data":
                        currentData.push(value);
                        break;
                    case "id":
                        currentId = value;
                        break;
                    case "retry":
                        // Ignored: the SDK controls retry policy, not the server.
                        break;
                }
            }
        }

        // Flush any final partial frame without a terminating blank line.
        buffer += decoder.decode();
        if (buffer.length > 0) {
            const { lines } = splitLines(buffer + "\n");
            for (const line of lines) {
                if (line === "") break;
                if (line.startsWith(":")) continue;
                const colonIndex = line.indexOf(":");
                const field = colonIndex === -1 ? line : line.slice(0, colonIndex);
                let value = colonIndex === -1 ? "" : line.slice(colonIndex + 1);
                if (value.startsWith(" ")) value = value.slice(1);
                if (field === "event") currentEvent = value || "message";
                else if (field === "data") currentData.push(value);
                else if (field === "id") currentId = value;
            }
        }

        if (currentData.length > 0) {
            yield { event: currentEvent, data: currentData.join("\n"), id: currentId };
        }
    } finally {
        options.signal?.removeEventListener("abort", onAbort);
        try { reader.releaseLock(); } catch { /* best-effort */ }
    }
}

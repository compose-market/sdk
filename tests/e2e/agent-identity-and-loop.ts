/**
 * End-to-end agent identity + multi-step + stop/resume + memory probe.
 *
 * Uses @compose-market/sdk to follow the canonical A2A x402 flow:
 *   1. Discover agents on Avalanche Fuji from the AgentFactory contract.
 *   2. POST /agent/:wallet/stream — receive 402 PAYMENT-REQUIRED.
 *   3. Sign Permit2 against the `upto` envelope.
 *   4. Retry with PAYMENT-SIGNATURE → stream SSE.
 *   5. Submit structured feedback after the run.
 *
 * Run from packages/sdk/:
 *   npx tsx tests/e2e/agent-identity-and-loop.ts
 *
 * Reads env from runtime/.env (deployer wallet, RPC). The SDK package has no
 * .env of its own — runtime/.env is the source of truth for these scripts.
 */

import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { config as loadEnv } from "dotenv";
loadEnv({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../runtime/.env") });
import { createPublicClient, http } from "viem";
import { avalancheFuji } from "viem/chains";
import { ComposeSDK, createPrivateKeyX402EvmWallet, type RunEvent } from "@compose-market/sdk";

const COMPOSE_API_URL = (process.env.COMPOSE_API_URL || "https://api.compose.market").replace(/\/+$/, "");
const FACTORY = (process.env.AGENT_FACTORY_CONTRACT || "").trim() as `0x${string}`;
const FUJI_RPC = (process.env.AVALANCHE_FUJI_RPC || "https://api.avax-test.network/ext/bc/C/rpc").trim();
const PINNED_AGENT = (process.env.AGENT_WALLET || "").trim().toLowerCase();
const DEPLOYER_KEY = process.env.DEPLOYER_KEY?.trim();
const CHAIN_ID = 43113;
// Cap each turn at 5 USDC ($5) of x402 settlement. Safer than uncapped.
const X402_MAX_AMOUNT_WEI = "5000000";

if (!FACTORY) throw new Error("AGENT_FACTORY_CONTRACT is required");
if (!DEPLOYER_KEY) throw new Error("DEPLOYER_KEY is required for x402 settlement signing");

const FACTORY_ABI = [
    {
        name: "totalAgents",
        type: "function",
        stateMutability: "view",
        inputs: [],
        outputs: [{ name: "total", type: "uint256" }],
    },
    {
        name: "getAgentData",
        type: "function",
        stateMutability: "view",
        inputs: [{ name: "agentWallet", type: "uint256" }],
        outputs: [{
            name: "data",
            type: "tuple",
            components: [
                { name: "dnaHash", type: "bytes32" },
                { name: "licenses", type: "uint256" },
                { name: "licensesMinted", type: "uint256" },
                { name: "licensePrice", type: "uint256" },
                { name: "creator", type: "address" },
                { name: "cloneable", type: "bool" },
                { name: "isClone", type: "bool" },
                { name: "parentAgentId", type: "uint256" },
                { name: "agentCardUri", type: "string" },
            ],
        }],
    },
] as const;

interface AgentSummary {
    agentWallet: bigint;
    walletAddress: string;
    name: string;
    description: string;
    framework: string;
    model: string;
    skills: string[];
    connectors: string[];
    cardCid: string;
}

function ipfsCid(uri: string): string {
    return uri.replace(/^ipfs:\/\//i, "").replace(/^\/+/, "").split("/")[0];
}

function pinataGatewayUrl(cid: string): string {
    const raw = (process.env.PINATA_GATEWAY_URL || "https://gateway.pinata.cloud").trim();
    const stripped = raw.replace(/\/+$/, "").replace(/\/ipfs$/, "");
    const withScheme = /^https?:\/\//i.test(stripped) ? stripped : `https://${stripped}`;
    return `${withScheme}/ipfs/${cid}`;
}

async function fetchAgentCard(cardCid: string): Promise<Record<string, unknown> | null> {
    try {
        const res = await fetch(pinataGatewayUrl(cardCid), { signal: AbortSignal.timeout(8000) });
        if (!res.ok) return null;
        return await res.json() as Record<string, unknown>;
    } catch {
        return null;
    }
}

async function discoverFujiAgents(): Promise<AgentSummary[]> {
    const client = createPublicClient({ chain: avalancheFuji, transport: http(FUJI_RPC) });
    const total = await client.readContract({
        address: FACTORY,
        abi: FACTORY_ABI,
        functionName: "totalAgents",
    }) as bigint;
    console.log(`[discover] AgentFactory ${FACTORY} on Fuji: totalAgents=${total}`);

    const out: AgentSummary[] = [];
    const ceiling = Number(total > 25n ? 25n : total);
    for (let i = 1; i <= ceiling; i += 1) {
        try {
            const data = await client.readContract({
                address: FACTORY,
                abi: FACTORY_ABI,
                functionName: "getAgentData",
                args: [BigInt(i)],
            }) as { agentCardUri: string };
            const cardCid = ipfsCid(data.agentCardUri);
            if (!cardCid) continue;
            const card = await fetchAgentCard(cardCid);
            if (!card?.walletAddress || typeof card.walletAddress !== "string") continue;
            out.push({
                agentWallet: BigInt(i),
                walletAddress: card.walletAddress.toLowerCase(),
                name: typeof card.name === "string" ? card.name : `Agent #${i}`,
                description: typeof card.description === "string" ? card.description : "",
                framework: typeof card.framework === "string" ? card.framework : "",
                model: typeof card.model === "string" ? card.model : "",
                skills: Array.isArray(card.skills) ? (card.skills as unknown[]).filter((s): s is string => typeof s === "string") : [],
                connectors: Array.isArray(card.connectors)
                    ? (card.connectors as unknown[]).map((p) => typeof p === "string" ? p : (p as { registryId?: string }).registryId).filter((p): p is string => Boolean(p))
                    : [],
                cardCid,
            });
        } catch (err) {
            // ignore
        }
    }
    return out;
}

async function pickAgent(): Promise<AgentSummary> {
    const all = await discoverFujiAgents();
    if (all.length === 0) throw new Error("No discoverable Fuji agents in factory");
    if (PINNED_AGENT) {
        const found = all.find((a) => a.walletAddress === PINNED_AGENT);
        if (!found) throw new Error(`AGENT_WALLET ${PINNED_AGENT} not found in factory`);
        return found;
    }
    // Only `manowar` framework agents are accepted by the runtime; framework="langchain" cards
    // are pre-existing and unsupported. Among manowar agents, prefer ones with non-empty connectors
    // so we can exercise multi-step tool use.
    const manowar = all.filter((a) => a.framework === "manowar");
    if (manowar.length === 0) {
        throw new Error(`No manowar-framework agents found among ${all.length} discovered`);
    }
    const withConnectors = manowar.find((a) => a.connectors.length > 0);
    return withConnectors ?? manowar[0];
}

interface StreamTrace {
    runId?: string;
    requestStart: number;
    firstEventAt?: number;
    firstTextDeltaAt?: number;
    firstToolStartAt?: number;
    firstToolArgsDeltaAt?: number;
    firstReceiptAt?: number;
    toolStarts: string[];
    toolEnds: string[];
    failedTools: string[];
    text: string;
    reasoning: string;
    receipt?: unknown;
    usage?: unknown;
    finishedAt?: number;
    stopped?: boolean;
}

function buildSdk(userAddress: string): ComposeSDK {
    const wallet = createPrivateKeyX402EvmWallet({
        privateKey: DEPLOYER_KEY!,
        rpcUrl: FUJI_RPC,
    });
    const sdk = new ComposeSDK({
        baseUrl: COMPOSE_API_URL,
        userAddress,
        chainId: CHAIN_ID,
        x402Signer: wallet.x402Signer,
    });
    return sdk;
}

async function streamChat(sdk: ComposeSDK, agent: AgentSummary, userAddress: string, message: string, options: {
    runId?: string;
    threadId?: string;
} = {}): Promise<StreamTrace> {
    const requestStart = Date.now();
    const trace: StreamTrace = {
        runId: options.runId,
        requestStart,
        toolStarts: [],
        toolEnds: [],
        failedTools: [],
        text: "",
        reasoning: "",
    };

    const iter = sdk.agent.stream({
        agentWallet: agent.walletAddress,
        userAddress,
        threadId: options.threadId ?? `e2e-thread-${options.runId ?? Math.random().toString(36).slice(2, 10)}`,
        composeRunId: options.runId,
        message,
    }, {
        x402MaxAmountWei: X402_MAX_AMOUNT_WEI,
        timeoutMs: 120_000,
    });

    trace.firstEventAt = Date.now() - requestStart;
    let final: unknown;
    try {
        for await (const event of iter) {
            const e = event as RunEvent;
            if (e.domain === "model" && e.type === "model.text.delta" && e.delta) {
                trace.firstTextDeltaAt = trace.firstTextDeltaAt ?? (Date.now() - requestStart);
                trace.text += e.delta;
            } else if (e.domain === "model" && e.type === "model.reasoning.delta" && e.delta) {
                trace.reasoning += e.delta;
            } else if (e.domain === "model" && e.type === "model.tool.delta") {
                trace.firstToolArgsDeltaAt = trace.firstToolArgsDeltaAt ?? (Date.now() - requestStart);
            } else if (e.domain === "activity" && e.kind === "tool" && e.status === "running") {
                trace.firstToolStartAt = trace.firstToolStartAt ?? (Date.now() - requestStart);
                trace.toolStarts.push(e.target?.name || e.name || "tool");
            } else if (e.domain === "activity" && e.kind === "tool" && (e.status === "completed" || e.status === "failed")) {
                const name = e.target?.name || e.name || "tool";
                trace.toolEnds.push(name);
                if (e.status === "failed") trace.failedTools.push(name);
            } else if (e.domain === "activity" && e.kind === "run" && e.status === "cancelled") {
                trace.stopped = true;
                trace.finishedAt = trace.finishedAt ?? (Date.now() - requestStart);
            } else if (e.domain === "activity" && e.kind === "run" && e.status === "completed") {
                trace.finishedAt = trace.finishedAt ?? (Date.now() - requestStart);
            } else if (e.domain === "activity" && e.kind === "error") {
                throw new Error(`runtime error: ${e.target?.summary || "stream error"}`);
            }
        }
        final = await iter.final();
    } catch (err) {
        if ((err as { name?: string }).name === "AbortError") {
            trace.finishedAt = trace.finishedAt ?? (Date.now() - requestStart);
        } else {
            throw err;
        }
    }
    if (final && typeof final === "object") {
        const f = final as { receipt?: unknown; budget?: unknown; requestId?: unknown };
        trace.receipt = f.receipt;
        if (f.receipt) trace.firstReceiptAt = trace.firstReceiptAt ?? (Date.now() - requestStart);
    }
    return trace;
}

async function probeIdentity(sdk: ComposeSDK, agent: AgentSummary, userAddress: string): Promise<{ pass: boolean; reason: string; trace: StreamTrace }> {
    const trace = await streamChat(sdk, agent, userAddress, "Who are you, briefly? State your name and what you can do for me.");
    const t = trace.text.toLowerCase();
    const expectedName = agent.name.toLowerCase();
    const nameTokens = expectedName.split(/\s+/).filter((tok) => tok.length >= 3);
    const nameMatch = nameTokens.length > 0
        ? nameTokens.every((tok) => t.includes(tok))
        : t.includes(expectedName);
    const fallback = /helpful assistant|i (am|'m) an ai\b/.test(t) && !nameMatch;
    return {
        pass: nameMatch && !fallback,
        reason: nameMatch
            ? (fallback ? "name found but fallback persona leaked" : "ok")
            : `agent.name "${agent.name}" not found in response`,
        trace,
    };
}

async function probeMultiStep(sdk: ComposeSDK, agent: AgentSummary, userAddress: string): Promise<{ pass: boolean; reason: string; trace: StreamTrace }> {
    const isPricey = agent.connectors.some((p) => /coin|price|dex|0x|cmc|coingecko|allora|defill/.test(p.toLowerCase()));
    const message = isPricey
        ? "What is the current USD price of bitcoin and how has it moved in the last 24h? Be concise."
        : "Search your memory for anything you remember about me, then summarise what you know.";
    const trace = await streamChat(sdk, agent, userAddress, message);
    return {
        pass: trace.toolEnds.length >= 1,
        reason: `tool_ends=${trace.toolEnds.length} (${trace.toolEnds.join(", ") || "none"})`,
        trace,
    };
}

async function probeStopResume(sdk: ComposeSDK, agent: AgentSummary, userAddress: string): Promise<{ pass: boolean; reason: string; first: StreamTrace; second: StreamTrace }> {
    const threadId = `e2e-thread-stop-${Math.random().toString(36).slice(2, 8)}`;
    const runIdA = `e2e-stop-${Math.random().toString(36).slice(2, 8)}`;
    const longPrompt = "Write a thoughtful 800-word essay on the history of computational logic, citing at least five thinkers and explaining the lineage of ideas in detail.";
    const startedAt = Date.now();
    const firstPromise = streamChat(sdk, agent, userAddress, longPrompt, { runId: runIdA, threadId });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let stopOk = false;
    try {
        const stop = await sdk.agent.stop({ agentWallet: agent.walletAddress, runId: runIdA, threadId });
        stopOk = Boolean(stop.stopped);
    } catch (err) {
        console.warn("[e2e] stop call failed:", err instanceof Error ? err.message : err);
    }
    const first = await firstPromise.catch((err) => ({
        runId: runIdA,
        requestStart: startedAt,
        text: "",
        reasoning: "",
        toolStarts: [],
        toolEnds: [],
        failedTools: [],
        stopped: true,
        error: String(err),
    } as StreamTrace & { error?: string }));

    const second = await streamChat(sdk, agent, userAddress, "Continue from where you stopped. Pick up where you left off and finish the essay.", {
        runId: `e2e-resume-${Math.random().toString(36).slice(2, 8)}`,
        threadId,
    });
    return {
        pass: stopOk && second.text.length > 0,
        reason: `stop.stopped=${stopOk} resume_text_len=${second.text.length}`,
        first,
        second,
    };
}

async function probeMemory(sdk: ComposeSDK, agent: AgentSummary, userAddress: string): Promise<{ pass: boolean; reason: string }> {
    const fact = `Test fact ${Math.random().toString(36).slice(2, 8)}: I am running e2e suite at ${new Date().toISOString()}.`;
    const turn = await streamChat(sdk, agent, userAddress, `Please remember the following exact fact: "${fact}". Just acknowledge briefly.`);
    if (!turn.text) return { pass: false, reason: "agent did not respond to memory-store turn" };

    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Use SDK memory.context to verify recall via the canonical agent-memory loop.
    try {
        const recall = await sdk.memory.context({
            agentWallet: agent.walletAddress,
            userAddress,
            query: fact,
            limit: 4,
            maxItems: 4,
            maxItemChars: 360,
            budget: { maxCharacters: 900 },
        });
        const totals = recall.totals || {};
        const total = Object.values(totals).reduce((acc: number, n) => acc + Number(n || 0), 0);
        const items = Array.isArray(recall.items) ? recall.items : [];
        const hit = items.some((item) => typeof item?.text === "string" && item.text.toLowerCase().includes(fact.slice(0, 24).toLowerCase()));
        return {
            pass: hit || total > 0,
            reason: `recall hit=${hit} totals=${JSON.stringify(totals)}`,
        };
    } catch (err) {
        return { pass: false, reason: `memory.context error: ${err instanceof Error ? err.message : String(err)}` };
    }
}

async function submitRunFeedback(
    sdk: ComposeSDK,
    agent: AgentSummary,
    overallPass: boolean,
    traces: {
        identity: StreamTrace;
        multiStep: StreamTrace;
        stopResumeSecond: StreamTrace;
    },
): Promise<string> {
    const identityReceipt = traces.identity.receipt as { txHash?: unknown } | undefined;
    const txHash = typeof identityReceipt?.txHash === "string" ? identityReceipt.txHash : undefined;
    const response = await sdk.feedback.agent(agent.agentWallet.toString(), {
        category: overallPass ? "quality" : "integration",
        rating: overallPass ? 5 : 2,
        message: overallPass
            ? "A2A identity, multi-step execution, stop/resume, and memory probes completed."
            : "A2A e2e probes produced at least one failing check.",
        labels: ["a2a", "x402", "e2e"],
        context: {
            agentWallet: agent.agentWallet.toString(),
            agentWallet: agent.walletAddress,
            chainId: CHAIN_ID,
            endpoint: {
                method: "POST",
                path: `/agent/${agent.walletAddress}/stream`,
            },
            receipt: {
                network: `eip155:${CHAIN_ID}`,
                ...(txHash ? { txHash } : {}),
            },
        },
        metadata: {
            agentName: agent.name,
            framework: agent.framework,
            model: agent.model,
            cardCid: agent.cardCid,
            timingsMs: {
                identity: traces.identity.finishedAt,
                multiStep: traces.multiStep.finishedAt,
                stopResume: traces.stopResumeSecond.finishedAt,
            },
            toolEnds: traces.multiStep.toolEnds,
            failedTools: traces.multiStep.failedTools,
        },
    });

    return response.feedbackId;
}

async function main() {
    const wallet = createPrivateKeyX402EvmWallet({ privateKey: DEPLOYER_KEY!, rpcUrl: FUJI_RPC });
    const userAddress = wallet.address.toLowerCase();
    console.log(`[e2e] api=${COMPOSE_API_URL} factory=${FACTORY} userAddress=${userAddress}`);
    const agent = await pickAgent();
    console.log(`[e2e] picked agent: ${agent.name} (${agent.walletAddress}) skills=${JSON.stringify(agent.skills)} connectors=${JSON.stringify(agent.connectors)}`);

    const sdk = buildSdk(userAddress);

    const idResult = await probeIdentity(sdk, agent, userAddress);
    console.log(`[e2e] identity: pass=${idResult.pass} reason="${idResult.reason}"`);
    console.log(`[e2e] identity: ttfb=${idResult.trace.firstTextDeltaAt}ms total=${idResult.trace.finishedAt}ms`);
    console.log(`[e2e] identity reply (first 400 chars): ${idResult.trace.text.slice(0, 400)}`);
    if (idResult.trace.receipt) console.log(`[e2e] identity receipt: ${JSON.stringify(idResult.trace.receipt).slice(0, 300)}`);

    const stepResult = await probeMultiStep(sdk, agent, userAddress);
    console.log(`[e2e] multi-step: pass=${stepResult.pass} reason="${stepResult.reason}"`);
    console.log(`[e2e] multi-step: ttfb=${stepResult.trace.firstTextDeltaAt}ms total=${stepResult.trace.finishedAt}ms tools=${JSON.stringify(stepResult.trace.toolStarts)} -> ${JSON.stringify(stepResult.trace.toolEnds)}`);
    console.log(`[e2e] multi-step reply (first 400 chars): ${stepResult.trace.text.slice(0, 400)}`);
    if (stepResult.trace.receipt) console.log(`[e2e] multi-step receipt: ${JSON.stringify(stepResult.trace.receipt).slice(0, 300)}`);

    const stopResult = await probeStopResume(sdk, agent, userAddress);
    console.log(`[e2e] stop-resume: pass=${stopResult.pass} reason="${stopResult.reason}"`);
    console.log(`[e2e] stop-resume first.text_len=${stopResult.first.text.length} second.text_len=${stopResult.second.text.length}`);

    const memoryResult = await probeMemory(sdk, agent, userAddress);
    console.log(`[e2e] memory: pass=${memoryResult.pass} reason="${memoryResult.reason}"`);

    const overall = idResult.pass && stepResult.pass && stopResult.pass && memoryResult.pass;
    const feedbackId = await submitRunFeedback(sdk, agent, overall, {
        identity: idResult.trace,
        multiStep: stepResult.trace,
        stopResumeSecond: stopResult.second,
    });
    console.log(`[e2e] feedback: id=${feedbackId} target=agent:${agent.agentWallet.toString()}`);

    console.log(`\n[e2e] OVERALL: ${overall ? "PASS" : "FAIL"}`);
    process.exit(overall ? 0 : 1);
}

main().catch((err) => {
    console.error("[e2e] fatal:", err);
    process.exit(2);
});

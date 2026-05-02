/**
 * Phase D end-to-end memory test (SDK consumer; runs against deployed runtime).
 *
 * 1. Turn 1 (intro thread):  introduce 4 durable facts.
 * 2. Wait for async fact extraction.
 * 3. Probe runtime admin endpoint /api/memory/<agentWallet> to confirm graph
 *    facts landed (cross-thread, source:"fact").
 * 4. Turn 2 (NEW thread):    "what do you know about me?" — verify the
 *    cross-layer ranker surfaces the facts.
 *
 * Run from packages/sdk/:
 *   npx tsx tests/e2e/memory-d-validation.ts
 */
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { config as loadEnv } from "dotenv";
loadEnv({ path: resolve(dirname(fileURLToPath(import.meta.url)), "../../../../runtime/.env") });

import { createPrivateKeyX402EvmWallet } from "@compose-market/sdk";
import { signAndStream, readGraphFacts } from "./util.js";

const AGENT = "0xa7abfd271130c3ee5c8f8862a123f3697e75af0d";       // Hello, friend
const USER_ADDRESS = "0x058271e764154c322f3d3ddc18af44f7d91b1c80"; // deployer
const API_BASE = process.env.COMPOSE_API_URL || "https://api.compose.market";
const FUJI_RPC = process.env.AVALANCHE_FUJI_RPC || "";
const CHAIN_ID = 43113;
const MAX_AMOUNT_WEI = "5000000";

async function main(): Promise<void> {
    const safety = setTimeout(() => {
        console.error("[memory-d] safety timeout");
        process.exit(1);
    }, 240_000);
    safety.unref();

    if (!process.env.DEPLOYER_KEY) throw new Error("DEPLOYER_KEY required");

    const wallet = createPrivateKeyX402EvmWallet({ privateKey: process.env.DEPLOYER_KEY, rpcUrl: FUJI_RPC });

    const intro = "Hi! I'm Alex. I'm a software engineer working on AI agents. My favorite color is azure, and I love jazz music. Just acknowledge briefly.";
    const recall = "What do you know about me? Use your memory tools.";
    const introThread = `phase-d-intro-${Date.now()}`;
    const recallThread = `phase-d-recall-${Date.now()}`;
    const common = { apiBase: API_BASE, agent: AGENT, userAddress: USER_ADDRESS, chainId: CHAIN_ID, maxAmountWei: MAX_AMOUNT_WEI, wallet };

    console.log(`==== TURN 1 (intro) thread=${introThread} ====`);
    const turn1 = await signAndStream({ ...common, threadId: introThread, message: intro });
    console.log(`  reply : ${turn1.text.slice(0, 200)}`);
    console.log(`  ttfb  : ${turn1.timeToFirstByteMs}ms   stream: ${turn1.streamMs}ms   total: ${turn1.elapsedMs}ms`);
    console.log(`  txHash: ${turn1.receiptTxHash ?? "n/a"}`);

    console.log("\n==== Wait 6s for async fact extraction ====");
    await new Promise((r) => setTimeout(r, 6000));

    console.log("\n==== GRAPH LAYER STATE ====");
    const facts = await readGraphFacts({ apiBase: API_BASE, agent: AGENT, userAddress: USER_ADDRESS });
    console.log(`  facts indexed: ${facts.length}`);
    for (const f of facts.slice(0, 8)) {
        const m = (f.metadata ?? {}) as Record<string, unknown>;
        console.log(`  [${m.factType ?? "?"}] (conf=${m.confidence ?? "?"}) ${f.memory ?? ""}`);
    }

    console.log(`\n==== TURN 2 (recall, NEW thread=${recallThread}) ====`);
    const turn2 = await signAndStream({ ...common, threadId: recallThread, message: recall });
    console.log(`  reply : ${turn2.text.slice(0, 400)}`);
    console.log(`  ttfb  : ${turn2.timeToFirstByteMs}ms   stream: ${turn2.streamMs}ms   total: ${turn2.elapsedMs}ms`);
    console.log(`  txHash: ${turn2.receiptTxHash ?? "n/a"}`);

    const lower = turn2.text.toLowerCase();
    const score = ["alex", "azure", "jazz", "engineer"].filter((k) => lower.includes(k)).length;
    console.log(`\n==== RECALL RESULT: ${score}/4 ====`);
    process.exit(score >= 2 ? 0 : 1);
}

main().catch((err) => {
    console.error("[memory-d] fatal:", err);
    process.exit(2);
});

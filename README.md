# `@compose-market/sdk`

Official Compose.Market SDK for wallet-tied Compose keys, x402 facilitator access, model discovery, and unified inference APIs.

## Install

```bash
npm install @compose-market/sdk
```

## Quick start

```ts
import { ComposeSDK, ComposePaymentRequiredError } from "@compose-market/sdk";

const sdk = new ComposeSDK();

await sdk.wallets.attach({
  address: "0x1234567890abcdef1234567890abcdef12345678",
  chainId: 84532,
});

const session = await sdk.keys.create({
  purpose: "session",
  budgetUsd: 5,
  durationHours: 2,
  name: "demo-session",
});

sdk.keys.use(session.token);

const models = await sdk.models.list();

try {
  const response = await sdk.inference.responses.create({
    model: "gpt-4.1-mini",
    input: [{ type: "input_text", text: "Say hello." }],
    modalities: ["text"],
  });

  console.log(response);
} catch (error) {
  if (error instanceof ComposePaymentRequiredError) {
    console.log(error.paymentRequired);
  }
  throw error;
}
```

## Main capabilities

- Attach a wallet or smart-account context through the same header contract used by Compose.Market apps.
- Create, list, revoke, and activate Compose keys for both session and API usage.
- Discover the full model catalog, per-model parameter schemas, and pricing data.
- Call Compose inference endpoints through Responses, Chat Completions, Images, Audio, Embeddings, and Video APIs.
- Decode and work with x402 `PAYMENT-REQUIRED` negotiation details.
- Call Compose facilitator `supported`, `verify`, and `settle` endpoints directly.

## Notes

- The SDK is runtime-neutral and works in modern Node.js and browser environments with a standards-compliant `fetch`.
- The core package does not bundle a wallet SDK. External apps can attach any already-known wallet or smart-account address and chain context.
- Session key creation requires the tied wallet or smart account to already have enough USDC balance and allowance for the requested budget on the selected chain. If not, the SDK throws a `ComposeApiError` with status `402`.

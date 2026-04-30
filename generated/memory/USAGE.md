<!-- Start SDK Example Usage [usage] -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.memory.contextAssemble({
    agentWallet: "<value>",
    query: "<value>",
  });

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->
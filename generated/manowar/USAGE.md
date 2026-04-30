<!-- Start SDK Example Usage [usage] -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  runtimeBearerAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.health.runtimeHealthCheck();

  console.log(result);
}

run();

```
<!-- End SDK Example Usage [usage] -->
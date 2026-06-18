# FeedbackContext

## Example Usage

```typescript
import { FeedbackContext } from "@compose-market/sdk/models";

let value: FeedbackContext = {
  agentWallet: "0x1111111111111111111111111111111111111111",
  receipt: {
    network: "eip155:43113",
    finalAmountWei: "1000000",
  },
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                | Example                                    |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `requestId`                                | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `paymentIntentId`                          | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `composeRunId`                             | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `chainId`                                  | *number*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `modelId`                                  | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `provider`                                 | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `agentWallet`                              | *string*                                   | :heavy_minus_sign:                         | N/A                                        | 0x1111111111111111111111111111111111111111 |
| `workflowWallet`                               | *string*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `endpoint`                                 | [models.Endpoint](../models/endpoint.md)   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `receipt`                                  | [models.Receipt](../models/receipt.md)     | :heavy_minus_sign:                         | N/A                                        |                                            |
| `sdk`                                      | [models.SDK](../models/sdk.md)             | :heavy_minus_sign:                         | N/A                                        |                                            |
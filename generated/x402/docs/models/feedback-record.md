# FeedbackRecord

## Example Usage

```typescript
import { FeedbackRecord } from "@compose-market/sdk/models";

let value: FeedbackRecord = {
  id: "<id>",
  target: {
    type: "workflow",
    id: "<id>",
  },
  category: "latency",
  labels: [
    "<value 1>",
  ],
  context: {
    agentWallet: "0x1111111111111111111111111111111111111111",
    receipt: {
      network: "eip155:43113",
      finalAmountWei: "1000000",
    },
  },
  metadata: {},
  verification: "wallet_header",
  createdAt: 517501,
};
```

## Fields

| Field                                                                      | Type                                                                       | Required                                                                   | Description                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `id`                                                                       | *string*                                                                   | :heavy_check_mark:                                                         | N/A                                                                        |
| `target`                                                                   | [models.FeedbackTarget](../models/feedback-target.md)                      | :heavy_check_mark:                                                         | N/A                                                                        |
| `category`                                                                 | [models.FeedbackCategory](../models/feedback-category.md)                  | :heavy_check_mark:                                                         | N/A                                                                        |
| `rating`                                                                   | *number*                                                                   | :heavy_minus_sign:                                                         | N/A                                                                        |
| `message`                                                                  | *string*                                                                   | :heavy_minus_sign:                                                         | N/A                                                                        |
| `labels`                                                                   | *string*[]                                                                 | :heavy_check_mark:                                                         | N/A                                                                        |
| `context`                                                                  | [models.FeedbackContext](../models/feedback-context.md)                    | :heavy_check_mark:                                                         | N/A                                                                        |
| `metadata`                                                                 | Record<string, *any*>                                                      | :heavy_check_mark:                                                         | N/A                                                                        |
| `verification`                                                             | [models.FeedbackVerificationKind](../models/feedback-verification-kind.md) | :heavy_check_mark:                                                         | N/A                                                                        |
| `createdAt`                                                                | *number*                                                                   | :heavy_check_mark:                                                         | N/A                                                                        |
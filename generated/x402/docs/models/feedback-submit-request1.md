# FeedbackSubmitRequest1

## Example Usage

```typescript
import { FeedbackSubmitRequest1 } from "@compose-market/sdk/models";

let value: FeedbackSubmitRequest1 = {
  target: {
    type: "workflow",
    id: "<id>",
  },
  rating: 322902,
  context: {
    agentWallet: "0x1111111111111111111111111111111111111111",
    receipt: {
      network: "eip155:43113",
      finalAmountWei: "1000000",
    },
  },
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `target`                                                  | [models.FeedbackTarget](../models/feedback-target.md)     | :heavy_check_mark:                                        | N/A                                                       |
| `category`                                                | [models.FeedbackCategory](../models/feedback-category.md) | :heavy_minus_sign:                                        | N/A                                                       |
| `rating`                                                  | *number*                                                  | :heavy_check_mark:                                        | N/A                                                       |
| `message`                                                 | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `labels`                                                  | *string*[]                                                | :heavy_minus_sign:                                        | N/A                                                       |
| `context`                                                 | [models.FeedbackContext](../models/feedback-context.md)   | :heavy_minus_sign:                                        | N/A                                                       |
| `metadata`                                                | Record<string, *any*>                                     | :heavy_minus_sign:                                        | N/A                                                       |
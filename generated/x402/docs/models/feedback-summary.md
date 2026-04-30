# FeedbackSummary

## Example Usage

```typescript
import { FeedbackSummary } from "@compose-market/sdk/models";

let value: FeedbackSummary = {
  target: {
    type: "workflow",
    id: "<id>",
  },
  count: 808955,
  ratingCount: 859836,
  ratingAverage: 2556.17,
  ratings: {
    one: 817093,
    two: 473826,
    three: 153358,
    four: 848326,
    five: 249809,
  },
  categories: {
    "key": 386213,
  },
  verification: {
    anonymous: 664097,
    walletHeader: 726832,
    composeKey: 860893,
  },
  recent: [
    {
      id: "<id>",
      target: {
        type: "workflow",
        id: "<id>",
      },
      category: "model_capability",
      labels: [
        "<value 1>",
        "<value 2>",
      ],
      context: {
        agentWallet: "0x1111111111111111111111111111111111111111",
        receipt: {
          network: "eip155:43113",
          finalAmountWei: "1000000",
        },
      },
      metadata: {
        "key": "<value>",
      },
      verification: "anonymous",
      createdAt: 373733,
    },
  ],
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `target`                                                | [models.FeedbackTarget](../models/feedback-target.md)   | :heavy_check_mark:                                      | N/A                                                     |
| `count`                                                 | *number*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `ratingCount`                                           | *number*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `ratingAverage`                                         | *number*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `ratings`                                               | [models.Ratings](../models/ratings.md)                  | :heavy_check_mark:                                      | N/A                                                     |
| `categories`                                            | Record<string, *number*>                                | :heavy_check_mark:                                      | N/A                                                     |
| `verification`                                          | [models.Verification](../models/verification.md)        | :heavy_check_mark:                                      | N/A                                                     |
| `recent`                                                | [models.FeedbackRecord](../models/feedback-record.md)[] | :heavy_check_mark:                                      | N/A                                                     |
# FeedbackListResponse

## Example Usage

```typescript
import { FeedbackListResponse } from "@compose-market/sdk/models";

let value: FeedbackListResponse = {
  object: "list",
  data: [
    {
      id: "<id>",
      target: {
        type: "workflow",
        id: "<id>",
      },
      category: "docs",
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
      metadata: {},
      verification: "compose_key",
      createdAt: 32531,
    },
  ],
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `object`                                                | *"list"*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `data`                                                  | [models.FeedbackRecord](../models/feedback-record.md)[] | :heavy_check_mark:                                      | N/A                                                     |
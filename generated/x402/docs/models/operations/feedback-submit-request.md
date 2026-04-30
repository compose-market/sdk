# FeedbackSubmitRequest

## Example Usage

```typescript
import { FeedbackSubmitRequest } from "@compose-market/sdk/models/operations";

let value: FeedbackSubmitRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  body: {
    target: {
      type: "workflow",
      id: "<id>",
    },
    rating: 189159,
    context: {
      agentWallet: "0x1111111111111111111111111111111111111111",
      receipt: {
        network: "eip155:43113",
        finalAmountWei: "1000000",
      },
    },
  },
};
```

## Fields

| Field                                      | Type                                       | Required                                   | Description                                | Example                                    |
| ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ | ------------------------------------------ |
| `xSessionUserAddress`                      | *string*                                   | :heavy_minus_sign:                         | N/A                                        | 0x1111111111111111111111111111111111111111 |
| `xChainId`                                 | *number*                                   | :heavy_minus_sign:                         | N/A                                        |                                            |
| `body`                                     | *models.FeedbackSubmitRequestUnion*        | :heavy_check_mark:                         | N/A                                        |                                            |
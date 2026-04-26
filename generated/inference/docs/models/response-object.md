# ResponseObject

## Example Usage

```typescript
import { ResponseObject } from "@compose-market/sdk/models";

let value: ResponseObject = {
  id: "<id>",
  object: "response",
  createdAt: 35624,
  status: "completed",
  model: "Volt",
  output: [
    {
      "key": "<value>",
      "key1": "<value>",
    },
    {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
    {
      "key": "<value>",
      "key1": "<value>",
    },
  ],
  composeReceipt: {
    lineItems: [
      {
        key: "<key>",
        unit: "joule",
        quantity: 1361.52,
        amountWei: "1000000",
      },
    ],
    providerAmountWei: "1000000",
    platformFeeWei: "1000000",
    finalAmountWei: "1000000",
    network: "eip155:43113",
  },
};
```

## Fields

| Field                                                              | Type                                                               | Required                                                           | Description                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ | ------------------------------------------------------------------ |
| `id`                                                               | *string*                                                           | :heavy_check_mark:                                                 | N/A                                                                |
| `object`                                                           | *"response"*                                                       | :heavy_check_mark:                                                 | N/A                                                                |
| `createdAt`                                                        | *number*                                                           | :heavy_check_mark:                                                 | N/A                                                                |
| `status`                                                           | [models.ResponseObjectStatus](../models/response-object-status.md) | :heavy_check_mark:                                                 | N/A                                                                |
| `model`                                                            | *string*                                                           | :heavy_check_mark:                                                 | N/A                                                                |
| `output`                                                           | Record<string, *any*>[]                                            | :heavy_check_mark:                                                 | N/A                                                                |
| `usage`                                                            | Record<string, *any*>                                              | :heavy_minus_sign:                                                 | N/A                                                                |
| `error`                                                            | Record<string, *any*>                                              | :heavy_minus_sign:                                                 | N/A                                                                |
| `previousResponseId`                                               | *string*                                                           | :heavy_minus_sign:                                                 | N/A                                                                |
| `jobId`                                                            | *string*                                                           | :heavy_minus_sign:                                                 | N/A                                                                |
| `composeReceipt`                                                   | [models.ComposeReceiptBody](../models/compose-receipt-body.md)     | :heavy_minus_sign:                                                 | N/A                                                                |
| `additionalProperties`                                             | Record<string, *any*>                                              | :heavy_minus_sign:                                                 | N/A                                                                |
# EmbeddingsResponse

## Example Usage

```typescript
import { EmbeddingsResponse } from "@compose-market/sdk/models";

let value: EmbeddingsResponse = {
  object: "list",
  data: [
    {
      "key": "<value>",
    },
    {
      "key": "<value>",
      "key1": "<value>",
    },
    {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
  ],
  model: "Countach",
  usage: {
    "key": "<value>",
    "key1": "<value>",
    "key2": "<value>",
  },
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

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `object`                                                       | *"list"*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `data`                                                         | Record<string, *any*>[]                                        | :heavy_check_mark:                                             | N/A                                                            |
| `model`                                                        | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `usage`                                                        | Record<string, *any*>                                          | :heavy_check_mark:                                             | N/A                                                            |
| `composeReceipt`                                               | [models.ComposeReceiptBody](../models/compose-receipt-body.md) | :heavy_minus_sign:                                             | N/A                                                            |
| `additionalProperties`                                         | Record<string, *any*>                                          | :heavy_minus_sign:                                             | N/A                                                            |
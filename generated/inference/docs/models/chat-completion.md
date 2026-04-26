# ChatCompletion

## Example Usage

```typescript
import { ChatCompletion } from "@compose-market/sdk/models";

let value: ChatCompletion = {
  id: "<id>",
  object: "chat.completion",
  created: 248389,
  model: "2",
  choices: [
    {},
    {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
    {
      "key": "<value>",
    },
  ],
  usage: {
    "key": "<value>",
    "key1": "<value>",
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
| `id`                                                           | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `object`                                                       | *"chat.completion"*                                            | :heavy_check_mark:                                             | N/A                                                            |
| `created`                                                      | *number*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `model`                                                        | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `choices`                                                      | Record<string, *any*>[]                                        | :heavy_check_mark:                                             | N/A                                                            |
| `usage`                                                        | Record<string, *any*>                                          | :heavy_check_mark:                                             | N/A                                                            |
| `composeReceipt`                                               | [models.ComposeReceiptBody](../models/compose-receipt-body.md) | :heavy_minus_sign:                                             | N/A                                                            |
| `additionalProperties`                                         | Record<string, *any*>                                          | :heavy_minus_sign:                                             | N/A                                                            |
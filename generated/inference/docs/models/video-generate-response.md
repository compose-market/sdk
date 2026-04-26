# VideoGenerateResponse

## Example Usage

```typescript
import { VideoGenerateResponse } from "@compose-market/sdk/models";

let value: VideoGenerateResponse = {
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
| `id`                                                           | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `object`                                                       | *"video.generation"*                                           | :heavy_minus_sign:                                             | N/A                                                            |
| `status`                                                       | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `created`                                                      | *number*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `model`                                                        | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `jobId`                                                        | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `data`                                                         | Record<string, *any*>[]                                        | :heavy_minus_sign:                                             | N/A                                                            |
| `composeReceipt`                                               | [models.ComposeReceiptBody](../models/compose-receipt-body.md) | :heavy_minus_sign:                                             | N/A                                                            |
| `additionalProperties`                                         | Record<string, *any*>                                          | :heavy_minus_sign:                                             | N/A                                                            |
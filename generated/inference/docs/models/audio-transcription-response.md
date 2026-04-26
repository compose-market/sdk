# AudioTranscriptionResponse

## Example Usage

```typescript
import { AudioTranscriptionResponse } from "@compose-market/sdk/models";

let value: AudioTranscriptionResponse = {
  text: "<value>",
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
| `text`                                                         | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `composeReceipt`                                               | [models.ComposeReceiptBody](../models/compose-receipt-body.md) | :heavy_minus_sign:                                             | N/A                                                            |
| `additionalProperties`                                         | Record<string, *any*>                                          | :heavy_minus_sign:                                             | N/A                                                            |
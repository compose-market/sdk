# ComposeReceiptBody

## Example Usage

```typescript
import { ComposeReceiptBody } from "@compose-market/sdk/models";

let value: ComposeReceiptBody = {
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
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               | Example                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `subject`                                                                 | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `lineItems`                                                               | [models.ComposeReceiptLineItem](../models/compose-receipt-line-item.md)[] | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `providerAmountWei`                                                       | *string*                                                                  | :heavy_minus_sign:                                                        | Non-negative integer amount in USDC atomic units.                         | 1000000                                                                   |
| `platformFeeWei`                                                          | *string*                                                                  | :heavy_minus_sign:                                                        | Non-negative integer amount in USDC atomic units.                         | 1000000                                                                   |
| `finalAmountWei`                                                          | *string*                                                                  | :heavy_minus_sign:                                                        | Non-negative integer amount in USDC atomic units.                         | 1000000                                                                   |
| `txHash`                                                                  | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `network`                                                                 | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       | eip155:43113                                                              |
| `settledAt`                                                               | *number*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `additionalProperties`                                                    | Record<string, *any*>                                                     | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
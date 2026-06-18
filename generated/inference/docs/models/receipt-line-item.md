# ReceiptLineItem

## Example Usage

```typescript
import { ReceiptLineItem } from "@compose-market/sdk/models";

let value: ReceiptLineItem = {
  key: "<key>",
  unit: "tesla",
  quantity: 2970.34,
  amountWei: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `key`                                             | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `unit`                                            | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `quantity`                                        | *number*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `unitPriceUsd`                                    | *number*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `amountWei`                                       | *string*                                          | :heavy_check_mark:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `additionalProperties`                            | Record<string, *any*>                             | :heavy_minus_sign:                                | N/A                                               |                                                   |
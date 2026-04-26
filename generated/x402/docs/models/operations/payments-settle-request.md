# PaymentsSettleRequest

## Example Usage

```typescript
import { PaymentsSettleRequest } from "@compose-market/sdk/models/operations";

let value: PaymentsSettleRequest = {
  paymentIntentId: "<id>",
  finalAmountWei: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `paymentIntentId`                                 | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `finalAmountWei`                                  | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `metering`                                        | Record<string, *any*>                             | :heavy_minus_sign:                                | N/A                                               |                                                   |
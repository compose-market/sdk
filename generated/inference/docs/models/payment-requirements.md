# PaymentRequirements

## Example Usage

```typescript
import { PaymentRequirements } from "@compose-market/sdk/models";

let value: PaymentRequirements = {
  scheme: "upto",
  network: "eip155:43113",
  amount: "1000000",
  asset: "0x1111111111111111111111111111111111111111",
  payTo: "0x1111111111111111111111111111111111111111",
  maxTimeoutSeconds: 101471,
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `scheme`                                          | [models.Scheme](../models/scheme.md)              | :heavy_check_mark:                                | N/A                                               |                                                   |
| `network`                                         | *string*                                          | :heavy_check_mark:                                | N/A                                               | eip155:43113                                      |
| `amount`                                          | *string*                                          | :heavy_check_mark:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `asset`                                           | *string*                                          | :heavy_check_mark:                                | N/A                                               | 0x1111111111111111111111111111111111111111        |
| `payTo`                                           | *string*                                          | :heavy_check_mark:                                | N/A                                               | 0x1111111111111111111111111111111111111111        |
| `maxTimeoutSeconds`                               | *number*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `extra`                                           | Record<string, *any*>                             | :heavy_minus_sign:                                | N/A                                               |                                                   |
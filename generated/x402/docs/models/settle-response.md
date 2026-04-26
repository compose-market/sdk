# SettleResponse

## Example Usage

```typescript
import { SettleResponse } from "@compose-market/sdk/models";

let value: SettleResponse = {
  success: true,
  network: "eip155:43113",
  amount: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `success`                                         | *boolean*                                         | :heavy_check_mark:                                | N/A                                               |                                                   |
| `errorReason`                                     | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `errorMessage`                                    | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `payer`                                           | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `transaction`                                     | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `network`                                         | *string*                                          | :heavy_minus_sign:                                | N/A                                               | eip155:43113                                      |
| `amount`                                          | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
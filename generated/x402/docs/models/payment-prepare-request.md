# PaymentPrepareRequest

## Example Usage

```typescript
import { PaymentPrepareRequest } from "@compose-market/sdk/models";

let value: PaymentPrepareRequest = {
  service: "<value>",
  action: "<value>",
  resource: "<value>",
  maxAmountWei: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `service`                                         | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `action`                                          | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `resource`                                        | *string*                                          | :heavy_check_mark:                                | N/A                                               |                                                   |
| `method`                                          | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `maxAmountWei`                                    | *string*                                          | :heavy_check_mark:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `metering`                                        | Record<string, *any*>                             | :heavy_minus_sign:                                | N/A                                               |                                                   |
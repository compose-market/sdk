# PaymentsPrepareRequest

## Example Usage

```typescript
import { PaymentsPrepareRequest } from "@compose-market/sdk/models/operations";

let value: PaymentsPrepareRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    service: "<value>",
    action: "<value>",
    resource: "<value>",
    maxAmountWei: "1000000",
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             | Example                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `xSessionUserAddress`                                                   | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     | 0x1111111111111111111111111111111111111111                              |
| `xChainId`                                                              | *number*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |                                                                         |
| `xX402MaxAmountWei`                                                     | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     | 1000000                                                                 |
| `body`                                                                  | [models.PaymentPrepareRequest](../../models/payment-prepare-request.md) | :heavy_check_mark:                                                      | N/A                                                                     |                                                                         |
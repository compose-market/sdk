# PaymentPayload

## Example Usage

```typescript
import { PaymentPayload } from "@compose-market/sdk/models";

let value: PaymentPayload = {
  x402Version: 2,
  accepted: {
    scheme: "upto",
    network: "eip155:43113",
    amount: "1000000",
    asset: "0x1111111111111111111111111111111111111111",
    payTo: "0x1111111111111111111111111111111111111111",
    maxTimeoutSeconds: 143115,
  },
  payload: "<value>",
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `x402Version`                                                   | *2*                                                             | :heavy_check_mark:                                              | N/A                                                             |
| `accepted`                                                      | [models.PaymentRequirements](../models/payment-requirements.md) | :heavy_check_mark:                                              | N/A                                                             |
| `payload`                                                       | *any*                                                           | :heavy_check_mark:                                              | Scheme-specific signed authorization payload.                   |
| `resource`                                                      | [models.ResourceProperties](../models/resource-properties.md)   | :heavy_minus_sign:                                              | N/A                                                             |
| `extensions`                                                    | Record<string, *any*>                                           | :heavy_minus_sign:                                              | N/A                                                             |
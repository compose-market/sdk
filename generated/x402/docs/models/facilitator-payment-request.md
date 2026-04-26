# FacilitatorPaymentRequest

## Example Usage

```typescript
import { FacilitatorPaymentRequest } from "@compose-market/sdk/models";

let value: FacilitatorPaymentRequest = {
  x402Version: 2,
  paymentPayload: {
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
  },
  paymentRequirements: {
    scheme: "exact",
    network: "eip155:43113",
    amount: "1000000",
    asset: "0x1111111111111111111111111111111111111111",
    payTo: "0x1111111111111111111111111111111111111111",
    maxTimeoutSeconds: 637539,
  },
};
```

## Fields

| Field                                                           | Type                                                            | Required                                                        | Description                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------- |
| `x402Version`                                                   | *2*                                                             | :heavy_check_mark:                                              | N/A                                                             |
| `paymentPayload`                                                | [models.PaymentPayload](../models/payment-payload.md)           | :heavy_check_mark:                                              | N/A                                                             |
| `paymentRequirements`                                           | [models.PaymentRequirements](../models/payment-requirements.md) | :heavy_check_mark:                                              | N/A                                                             |
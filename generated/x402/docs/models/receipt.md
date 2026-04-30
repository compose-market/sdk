# Receipt

## Example Usage

```typescript
import { Receipt } from "@compose-market/sdk/models";

let value: Receipt = {
  network: "eip155:43113",
  finalAmountWei: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `network`                                         | *string*                                          | :heavy_minus_sign:                                | N/A                                               | eip155:43113                                      |
| `txHash`                                          | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `finalAmountWei`                                  | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
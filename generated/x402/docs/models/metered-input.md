# MeteredInput

## Example Usage

```typescript
import { MeteredInput } from "@compose-market/sdk/models";

let value: MeteredInput = {
  subject: "<value>",
  lineItems: [
    {
      key: "<key>",
      unit: "coulomb",
      quantity: 8274.87,
      unitPriceUsd: 491.14,
    },
  ],
};
```

## Fields

| Field                                       | Type                                        | Required                                    | Description                                 |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| `subject`                                   | *string*                                    | :heavy_check_mark:                          | N/A                                         |
| `lineItems`                                 | [models.LineItem](../models/line-item.md)[] | :heavy_check_mark:                          | N/A                                         |
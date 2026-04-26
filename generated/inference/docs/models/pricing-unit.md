# PricingUnit

## Example Usage

```typescript
import { PricingUnit } from "@compose-market/sdk/models";

let value: PricingUnit = {
  unitKey: "<value>",
  entries: {},
  valueKeys: [
    "<value 1>",
  ],
};
```

## Fields

| Field                    | Type                     | Required                 | Description              |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `unitKey`                | *string*                 | :heavy_check_mark:       | N/A                      |
| `unit`                   | *string*                 | :heavy_minus_sign:       | N/A                      |
| `header`                 | *string*                 | :heavy_minus_sign:       | N/A                      |
| `entries`                | Record<string, *number*> | :heavy_check_mark:       | N/A                      |
| `valueKeys`              | *string*[]               | :heavy_check_mark:       | N/A                      |
| `default`                | *boolean*                | :heavy_minus_sign:       | N/A                      |
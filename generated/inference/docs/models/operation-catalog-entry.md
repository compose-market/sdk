# OperationCatalogEntry

## Example Usage

```typescript
import { OperationCatalogEntry } from "@compose-market/sdk/models";

let value: OperationCatalogEntry = {
  operation: "<value>",
  modelCount: 86388,
  sourceTypes: [],
  pricingUnits: [
    {
      unitKey: "<value>",
      entries: {
        "key": 3618.58,
      },
      valueKeys: [],
    },
  ],
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `operation`                                       | *string*                                          | :heavy_check_mark:                                | N/A                                               |
| `modelCount`                                      | *number*                                          | :heavy_check_mark:                                | N/A                                               |
| `sourceTypes`                                     | *string*[]                                        | :heavy_check_mark:                                | N/A                                               |
| `pricingUnits`                                    | [models.PricingUnit](../models/pricing-unit.md)[] | :heavy_check_mark:                                | N/A                                               |
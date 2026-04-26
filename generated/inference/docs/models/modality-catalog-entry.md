# ModalityCatalogEntry

## Example Usage

```typescript
import { ModalityCatalogEntry } from "@compose-market/sdk/models";

let value: ModalityCatalogEntry = {
  modality: "image",
  operations: [
    {
      operation: "<value>",
      modelCount: 27446,
      sourceTypes: [
        "<value 1>",
        "<value 2>",
        "<value 3>",
      ],
      pricingUnits: [
        {
          unitKey: "<value>",
          entries: {
            "key": 3618.58,
          },
          valueKeys: [],
        },
      ],
    },
  ],
  modelCount: 618779,
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

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `modality`                                                             | [models.CanonicalModality](../models/canonical-modality.md)            | :heavy_check_mark:                                                     | N/A                                                                    |
| `operations`                                                           | [models.OperationCatalogEntry](../models/operation-catalog-entry.md)[] | :heavy_check_mark:                                                     | N/A                                                                    |
| `modelCount`                                                           | *number*                                                               | :heavy_check_mark:                                                     | N/A                                                                    |
| `pricingUnits`                                                         | [models.PricingUnit](../models/pricing-unit.md)[]                      | :heavy_check_mark:                                                     | N/A                                                                    |
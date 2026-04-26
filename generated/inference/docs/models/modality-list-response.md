# ModalityListResponse

## Example Usage

```typescript
import { ModalityListResponse } from "@compose-market/sdk/models";

let value: ModalityListResponse = {
  object: "list",
  data: [
    {
      modality: "embedding",
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
      modelCount: 340999,
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
};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `object`                                                             | *"list"*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `data`                                                               | [models.ModalityCatalogEntry](../models/modality-catalog-entry.md)[] | :heavy_check_mark:                                                   | N/A                                                                  |
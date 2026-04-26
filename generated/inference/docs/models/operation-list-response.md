# OperationListResponse

## Example Usage

```typescript
import { OperationListResponse } from "@compose-market/sdk/models";

let value: OperationListResponse = {
  object: "list",
  data: [
    {
      operation: "<value>",
      modelCount: 963276,
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
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `object`                                                               | *"list"*                                                               | :heavy_check_mark:                                                     | N/A                                                                    |
| `data`                                                                 | [models.OperationCatalogEntry](../models/operation-catalog-entry.md)[] | :heavy_check_mark:                                                     | N/A                                                                    |
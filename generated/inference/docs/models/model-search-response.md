# ModelSearchResponse

## Example Usage

```typescript
import { ModelSearchResponse } from "@compose-market/sdk/models";

let value: ModelSearchResponse = {
  object: "list",
  data: [
    {
      modelId: "<id>",
      provider: "roboflow",
    },
  ],
  total: 950736,
  nextCursor: null,
};
```

## Fields

| Field                                | Type                                 | Required                             | Description                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| `object`                             | *"list"*                             | :heavy_check_mark:                   | N/A                                  |
| `data`                               | [models.Model](../models/model.md)[] | :heavy_check_mark:                   | N/A                                  |
| `total`                              | *number*                             | :heavy_check_mark:                   | N/A                                  |
| `nextCursor`                         | *string*                             | :heavy_check_mark:                   | N/A                                  |
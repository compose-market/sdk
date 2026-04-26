# ModelListResponse

## Example Usage

```typescript
import { ModelListResponse } from "@compose-market/sdk/models";

let value: ModelListResponse = {
  object: "list",
  data: [
    {
      modelId: "<id>",
      provider: "roboflow",
    },
  ],
};
```

## Fields

| Field                                | Type                                 | Required                             | Description                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| `object`                             | *"list"*                             | :heavy_check_mark:                   | N/A                                  |
| `data`                               | [models.Model](../models/model.md)[] | :heavy_check_mark:                   | N/A                                  |
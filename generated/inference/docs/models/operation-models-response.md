# OperationModelsResponse

## Example Usage

```typescript
import { OperationModelsResponse } from "@compose-market/sdk/models";

let value: OperationModelsResponse = {
  object: "list",
  data: [],
  total: 424763,
  nextCursor: "<value>",
};
```

## Fields

| Field                                                   | Type                                                    | Required                                                | Description                                             |
| ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------- |
| `object`                                                | *"list"*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `data`                                                  | [models.OperationModel](../models/operation-model.md)[] | :heavy_check_mark:                                      | N/A                                                     |
| `total`                                                 | *number*                                                | :heavy_check_mark:                                      | N/A                                                     |
| `nextCursor`                                            | *string*                                                | :heavy_check_mark:                                      | N/A                                                     |
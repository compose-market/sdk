# ConflictsResolveRequest

## Example Usage

```typescript
import { ConflictsResolveRequest } from "@compose-market/sdk/models/operations";

let value: ConflictsResolveRequest = {
  id: "<id>",
  body: {
    resolution: "keep",
  },
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `id`                                                                                   | *string*                                                                               | :heavy_check_mark:                                                                     | N/A                                                                                    |
| `body`                                                                                 | [models.MemoryConflictResolveRequest](../../models/memory-conflict-resolve-request.md) | :heavy_check_mark:                                                                     | N/A                                                                                    |
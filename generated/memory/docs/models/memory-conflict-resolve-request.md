# MemoryConflictResolveRequest

## Example Usage

```typescript
import { MemoryConflictResolveRequest } from "@compose-market/sdk/models";

let value: MemoryConflictResolveRequest = {
  resolution: "ignore",
};
```

## Fields

| Field                                        | Type                                         | Required                                     | Description                                  |
| -------------------------------------------- | -------------------------------------------- | -------------------------------------------- | -------------------------------------------- |
| `agentWallet`                                | *string*                                     | :heavy_minus_sign:                           | N/A                                          |
| `resolution`                                 | [models.Resolution](../models/resolution.md) | :heavy_check_mark:                           | N/A                                          |
| `winningMemoryId`                            | *string*                                     | :heavy_minus_sign:                           | N/A                                          |
| `reason`                                     | *string*                                     | :heavy_minus_sign:                           | N/A                                          |
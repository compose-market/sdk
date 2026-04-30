# MemoryVectorItem

## Example Usage

```typescript
import { MemoryVectorItem } from "@compose-market/sdk/models";

let value: MemoryVectorItem = {
  id: "<id>",
  content: "<value>",
  score: 1415.62,
  source: "archive",
  agentWallet: "<value>",
  decayScore: 4225.2,
  accessCount: 717781,
  createdAt: 639911,
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `id`                                                                    | *string*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `vectorId`                                                              | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `content`                                                               | *string*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `score`                                                                 | *number*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `source`                                                                | [models.MemoryVectorItemSource](../models/memory-vector-item-source.md) | :heavy_check_mark:                                                      | N/A                                                                     |
| `agentWallet`                                                           | *string*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `userAddress`                                                           | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `threadId`                                                              | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `mode`                                                                  | [models.MemoryVectorItemMode](../models/memory-vector-item-mode.md)     | :heavy_minus_sign:                                                      | N/A                                                                     |
| `haiId`                                                                 | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `decayScore`                                                            | *number*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `accessCount`                                                           | *number*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `createdAt`                                                             | *number*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `embedding`                                                             | *number*[]                                                              | :heavy_minus_sign:                                                      | N/A                                                                     |
| `metadata`                                                              | Record<string, *any*>                                                   | :heavy_minus_sign:                                                      | N/A                                                                     |
| `lastAccessedAt`                                                        | *number*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `updatedAt`                                                             | *number*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
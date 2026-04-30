# MemoryItemResponse

## Example Usage

```typescript
import { MemoryItemResponse } from "@compose-market/sdk/models";

let value: MemoryItemResponse = {
  item: {
    id: "<id>",
    content: "<value>",
    score: 9592.47,
    source: "fact",
    agentWallet: "<value>",
    decayScore: 1324.61,
    accessCount: 893042,
    createdAt: 770391,
  },
};
```

## Fields

| Field                                                      | Type                                                       | Required                                                   | Description                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------- |
| `item`                                                     | [models.MemoryVectorItem](../models/memory-vector-item.md) | :heavy_check_mark:                                         | N/A                                                        |
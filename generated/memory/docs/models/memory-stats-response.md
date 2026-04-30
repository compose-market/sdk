# MemoryStatsResponse

## Example Usage

```typescript
import { MemoryStatsResponse } from "@compose-market/sdk/models";

let value: MemoryStatsResponse = {
  totalVectors: 691765,
  totalTranscripts: 657706,
  avgDecayScore: 4016.29,
  oldestVector: 358278,
  newestVector: 858066,
  byType: {
    "key": 127134,
    "key1": 137437,
    "key2": 963451,
  },
};
```

## Fields

| Field                    | Type                     | Required                 | Description              |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `totalVectors`           | *number*                 | :heavy_check_mark:       | N/A                      |
| `totalTranscripts`       | *number*                 | :heavy_check_mark:       | N/A                      |
| `avgDecayScore`          | *number*                 | :heavy_check_mark:       | N/A                      |
| `oldestVector`           | *number*                 | :heavy_check_mark:       | N/A                      |
| `newestVector`           | *number*                 | :heavy_check_mark:       | N/A                      |
| `byType`                 | Record<string, *number*> | :heavy_check_mark:       | N/A                      |
# SearchResult

## Example Usage

```typescript
import { SearchResult } from "@compose-market/sdk/models";

let value: SearchResult = {
  id: "<id>",
  content: "<value>",
  score: 922.83,
  source: "session",
  agentWallet: "<value>",
  decayScore: 7090.86,
  accessCount: 480142,
  createdAt: 377489,
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `id`                                                           | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `vectorId`                                                     | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `content`                                                      | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `score`                                                        | *number*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `source`                                                       | [models.SearchResultSource](../models/search-result-source.md) | :heavy_check_mark:                                             | N/A                                                            |
| `agentWallet`                                                  | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `userAddress`                                                  | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `threadId`                                                     | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `mode`                                                         | [models.SearchResultMode](../models/search-result-mode.md)     | :heavy_minus_sign:                                             | N/A                                                            |
| `haiId`                                                        | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `decayScore`                                                   | *number*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `accessCount`                                                  | *number*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `createdAt`                                                    | *number*                                                       | :heavy_check_mark:                                             | N/A                                                            |
# VectorIndexRequest

## Example Usage

```typescript
import { VectorIndexRequest } from "@compose-market/sdk/models";

let value: VectorIndexRequest = {
  content: "<value>",
  embedding: [
    7831.38,
    166.89,
    4310,
  ],
  agentWallet: "<value>",
  source: "archive",
};
```

## Fields

| Field                                | Type                                 | Required                             | Description                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| `content`                            | *string*                             | :heavy_check_mark:                   | N/A                                  |
| `embedding`                          | *number*[]                           | :heavy_check_mark:                   | N/A                                  |
| `agentWallet`                        | *string*                             | :heavy_check_mark:                   | N/A                                  |
| `userAddress`                        | *string*                             | :heavy_minus_sign:                   | N/A                                  |
| `threadId`                           | *string*                             | :heavy_minus_sign:                   | N/A                                  |
| `source`                             | [models.Source](../models/source.md) | :heavy_check_mark:                   | N/A                                  |
| `metadata`                           | Record<string, *any*>                | :heavy_minus_sign:                   | N/A                                  |
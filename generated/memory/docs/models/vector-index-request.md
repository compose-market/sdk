# VectorIndexRequest

## Example Usage

```typescript
import { VectorIndexRequest } from "@compose-market/sdk/models";

let value: VectorIndexRequest = {
  content: "<value>",
  agentWallet: "<value>",
  source: "fact",
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `content`                                                               | *string*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `embedding`                                                             | *number*[]                                                              | :heavy_minus_sign:                                                      | N/A                                                                     |
| `agentWallet`                                                           | *string*                                                                | :heavy_check_mark:                                                      | N/A                                                                     |
| `userAddress`                                                           | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `threadId`                                                              | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `mode`                                                                  | [models.VectorIndexRequestMode](../models/vector-index-request-mode.md) | :heavy_minus_sign:                                                      | N/A                                                                     |
| `haiId`                                                                 | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |
| `source`                                                                | [models.SourceRequestBody](../models/source-request-body.md)            | :heavy_check_mark:                                                      | N/A                                                                     |
| `metadata`                                                              | Record<string, *any*>                                                   | :heavy_minus_sign:                                                      | N/A                                                                     |
# MemorySearchRequest

## Example Usage

```typescript
import { MemorySearchRequest } from "@compose-market/sdk/models";

let value: MemorySearchRequest = {
  query: "<value>",
};
```

## Fields

| Field                 | Type                  | Required              | Description           |
| --------------------- | --------------------- | --------------------- | --------------------- |
| `query`               | *string*              | :heavy_check_mark:    | N/A                   |
| `agentWallet`         | *string*              | :heavy_minus_sign:    | N/A                   |
| `agentId`             | *string*              | :heavy_minus_sign:    | N/A                   |
| `userAddress`         | *string*              | :heavy_minus_sign:    | N/A                   |
| `userId`              | *string*              | :heavy_minus_sign:    | N/A                   |
| `threadId`            | *string*              | :heavy_minus_sign:    | N/A                   |
| `runId`               | *string*              | :heavy_minus_sign:    | N/A                   |
| `limit`               | *number*              | :heavy_minus_sign:    | N/A                   |
| `layers`              | *string*[]            | :heavy_minus_sign:    | N/A                   |
| `filters`             | Record<string, *any*> | :heavy_minus_sign:    | N/A                   |
| `rerank`              | *boolean*             | :heavy_minus_sign:    | N/A                   |
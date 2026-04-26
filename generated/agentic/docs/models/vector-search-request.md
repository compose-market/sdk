# VectorSearchRequest

## Example Usage

```typescript
import { VectorSearchRequest } from "@compose-market/sdk/models";

let value: VectorSearchRequest = {
  query: "<value>",
  agentWallet: "<value>",
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `query`            | *string*           | :heavy_check_mark: | N/A                |
| `queryEmbedding`   | *number*[]         | :heavy_minus_sign: | N/A                |
| `agentWallet`      | *string*           | :heavy_check_mark: | N/A                |
| `userAddress`      | *string*           | :heavy_minus_sign: | N/A                |
| `threadId`         | *string*           | :heavy_minus_sign: | N/A                |
| `limit`            | *number*           | :heavy_minus_sign: | N/A                |
| `threshold`        | *number*           | :heavy_minus_sign: | N/A                |
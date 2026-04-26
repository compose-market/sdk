# TranscriptStoreRequest

## Example Usage

```typescript
import { TranscriptStoreRequest } from "@compose-market/sdk/models";

let value: TranscriptStoreRequest = {
  sessionId: "<id>",
  threadId: "<id>",
  agentWallet: "<value>",
  messages: [
    {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
    {},
  ],
  tokenCount: 824783,
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `sessionId`             | *string*                | :heavy_check_mark:      | N/A                     |
| `threadId`              | *string*                | :heavy_check_mark:      | N/A                     |
| `agentWallet`           | *string*                | :heavy_check_mark:      | N/A                     |
| `userAddress`           | *string*                | :heavy_minus_sign:      | N/A                     |
| `messages`              | Record<string, *any*>[] | :heavy_check_mark:      | N/A                     |
| `tokenCount`            | *number*                | :heavy_check_mark:      | N/A                     |
| `summary`               | *string*                | :heavy_minus_sign:      | N/A                     |
| `summaryEmbedding`      | *number*[]              | :heavy_minus_sign:      | N/A                     |
| `metadata`              | Record<string, *any*>   | :heavy_minus_sign:      | N/A                     |
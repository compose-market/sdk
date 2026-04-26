# MemoryAddRequest

## Example Usage

```typescript
import { MemoryAddRequest } from "@compose-market/sdk/models";

let value: MemoryAddRequest = {
  messages: [
    {
      "key": "<value>",
      "key1": "<value>",
    },
    {
      "key": "<value>",
      "key1": "<value>",
    },
    {},
  ],
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `messages`              | Record<string, *any*>[] | :heavy_check_mark:      | N/A                     |
| `agentWallet`           | *string*                | :heavy_minus_sign:      | N/A                     |
| `agentId`               | *string*                | :heavy_minus_sign:      | N/A                     |
| `userAddress`           | *string*                | :heavy_minus_sign:      | N/A                     |
| `userId`                | *string*                | :heavy_minus_sign:      | N/A                     |
| `runId`                 | *string*                | :heavy_minus_sign:      | N/A                     |
| `metadata`              | Record<string, *any*>   | :heavy_minus_sign:      | N/A                     |
| `enableGraph`           | *boolean*               | :heavy_minus_sign:      | N/A                     |
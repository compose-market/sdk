# SessionMemory

## Example Usage

```typescript
import { SessionMemory } from "@compose-market/sdk/models";

let value: SessionMemory = {
  sessionId: "<id>",
  agentWallet: "<value>",
  workingMemory: {
    context: [
      "<value 1>",
      "<value 2>",
    ],
    entities: {
      "key": "<value>",
    },
    state: {
      "key": "Idaho",
      "key1": "Hawaii",
    },
  },
  compressed: true,
  createdAt: 290506,
  expiresAt: 726215,
  lastAccessedAt: 92031,
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `sessionId`                                                  | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `agentWallet`                                                | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `userAddress`                                                | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |
| `threadId`                                                   | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |
| `mode`                                                       | [models.SessionMemoryMode](../models/session-memory-mode.md) | :heavy_minus_sign:                                           | N/A                                                          |
| `haiId`                                                      | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |
| `workingMemory`                                              | [models.WorkingMemory](../models/working-memory.md)          | :heavy_check_mark:                                           | N/A                                                          |
| `metadata`                                                   | Record<string, *any*>                                        | :heavy_minus_sign:                                           | N/A                                                          |
| `compressed`                                                 | *boolean*                                                    | :heavy_check_mark:                                           | N/A                                                          |
| `createdAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `expiresAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |
| `lastAccessedAt`                                             | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |
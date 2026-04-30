# AgentMemoryContextRequest

## Example Usage

```typescript
import { AgentMemoryContextRequest } from "@compose-market/sdk/models";

let value: AgentMemoryContextRequest = {
  agentWallet: "<value>",
  query: "<value>",
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `agentWallet`                                                                          | *string*                                                                               | :heavy_check_mark:                                                                     | N/A                                                                                    |
| `userAddress`                                                                          | *string*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `threadId`                                                                             | *string*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `mode`                                                                                 | [models.AgentMemoryContextRequestMode](../models/agent-memory-context-request-mode.md) | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `haiId`                                                                                | *string*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `filters`                                                                              | Record<string, *any*>                                                                  | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `metadata`                                                                             | Record<string, *any*>                                                                  | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `query`                                                                                | *string*                                                                               | :heavy_check_mark:                                                                     | N/A                                                                                    |
| `layers`                                                                               | [models.AgentMemoryLayer](../models/agent-memory-layer.md)[]                           | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `limit`                                                                                | *number*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `maxItems`                                                                             | *number*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `maxItemChars`                                                                         | *number*                                                                               | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `budget`                                                                               | [models.AgentMemoryBudget](../models/agent-memory-budget.md)                           | :heavy_minus_sign:                                                                     | N/A                                                                                    |
| `includeRaw`                                                                           | *boolean*                                                                              | :heavy_minus_sign:                                                                     | N/A                                                                                    |
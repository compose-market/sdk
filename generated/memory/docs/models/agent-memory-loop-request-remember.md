# AgentMemoryLoopRequestRemember

## Example Usage

```typescript
import { AgentMemoryLoopRequestRemember } from "@compose-market/sdk/models";

let value: AgentMemoryLoopRequestRemember = {
  agentWallet: "<value>",
  content: "<value>",
  step: "remember",
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `agentWallet`                                                                      | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |
| `userAddress`                                                                      | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `threadId`                                                                         | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `mode`                                                                             | [models.AgentMemoryLoopRequestMode3](../models/agent-memory-loop-request-mode3.md) | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `haiId`                                                                            | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `filters`                                                                          | Record<string, *any*>                                                              | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `metadata`                                                                         | Record<string, *any*>                                                              | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `content`                                                                          | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |
| `type`                                                                             | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `scope`                                                                            | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `retention`                                                                        | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `conflictPolicy`                                                                   | *string*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `confidence`                                                                       | *number*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `enableGraph`                                                                      | *boolean*                                                                          | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `step`                                                                             | *"remember"*                                                                       | :heavy_check_mark:                                                                 | N/A                                                                                |
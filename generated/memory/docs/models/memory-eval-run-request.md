# MemoryEvalRunRequest

## Example Usage

```typescript
import { MemoryEvalRunRequest } from "@compose-market/sdk/models";

let value: MemoryEvalRunRequest = {
  agentWallet: "<value>",
  testCases: [
    {
      query: "<value>",
    },
  ],
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `agentWallet`                                                                | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |
| `userAddress`                                                                | *string*                                                                     | :heavy_minus_sign:                                                           | N/A                                                                          |
| `threadId`                                                                   | *string*                                                                     | :heavy_minus_sign:                                                           | N/A                                                                          |
| `mode`                                                                       | [models.MemoryEvalRunRequestMode](../models/memory-eval-run-request-mode.md) | :heavy_minus_sign:                                                           | N/A                                                                          |
| `haiId`                                                                      | *string*                                                                     | :heavy_minus_sign:                                                           | N/A                                                                          |
| `filters`                                                                    | Record<string, *any*>                                                        | :heavy_minus_sign:                                                           | N/A                                                                          |
| `metadata`                                                                   | Record<string, *any*>                                                        | :heavy_minus_sign:                                                           | N/A                                                                          |
| `layers`                                                                     | [models.AgentMemoryLayer](../models/agent-memory-layer.md)[]                 | :heavy_minus_sign:                                                           | N/A                                                                          |
| `testCases`                                                                  | [models.MemoryEvalTestCase](../models/memory-eval-test-case.md)[]            | :heavy_check_mark:                                                           | N/A                                                                          |
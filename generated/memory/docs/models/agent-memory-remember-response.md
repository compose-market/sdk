# AgentMemoryRememberResponse

## Example Usage

```typescript
import { AgentMemoryRememberResponse } from "@compose-market/sdk/models";

let value: AgentMemoryRememberResponse = {
  workflow: {
    v: "compose.agent_memory.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  success: true,
  graphSaved: false,
  vectorSaved: false,
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `workflow`                                                                        | [models.AgentMemoryWorkflowEnvelope](../models/agent-memory-workflow-envelope.md) | :heavy_check_mark:                                                                | N/A                                                                               |
| `success`                                                                         | *boolean*                                                                         | :heavy_check_mark:                                                                | N/A                                                                               |
| `graphSaved`                                                                      | *boolean*                                                                         | :heavy_check_mark:                                                                | N/A                                                                               |
| `vectorSaved`                                                                     | *boolean*                                                                         | :heavy_check_mark:                                                                | N/A                                                                               |
| `vectorId`                                                                        | *string*                                                                          | :heavy_minus_sign:                                                                | N/A                                                                               |
| `memory`                                                                          | [models.MemoryRememberedItem](../models/memory-remembered-item.md)                | :heavy_minus_sign:                                                                | N/A                                                                               |
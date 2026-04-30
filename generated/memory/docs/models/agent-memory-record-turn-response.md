# AgentMemoryRecordTurnResponse

## Example Usage

```typescript
import { AgentMemoryRecordTurnResponse } from "@compose-market/sdk/models";

let value: AgentMemoryRecordTurnResponse = {
  workflow: {
    v: "compose.agent_memory.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  success: true,
  sessionId: "<id>",
  threadId: "<id>",
  turnId: "<id>",
  stored: {
    transcript: false,
    working: false,
    vector: false,
  },
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `workflow`                                                                        | [models.AgentMemoryWorkflowEnvelope](../models/agent-memory-workflow-envelope.md) | :heavy_check_mark:                                                                | N/A                                                                               |
| `success`                                                                         | *true*                                                                            | :heavy_check_mark:                                                                | N/A                                                                               |
| `sessionId`                                                                       | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `threadId`                                                                        | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `turnId`                                                                          | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `vectorId`                                                                        | *string*                                                                          | :heavy_minus_sign:                                                                | N/A                                                                               |
| `stored`                                                                          | [models.Stored](../models/stored.md)                                              | :heavy_check_mark:                                                                | N/A                                                                               |
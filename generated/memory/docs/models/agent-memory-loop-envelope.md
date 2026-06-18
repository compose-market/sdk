# AgentMemoryLoopEnvelope

## Example Usage

```typescript
import { AgentMemoryLoopEnvelope } from "@compose-market/sdk/models";

let value: AgentMemoryLoopEnvelope = {
  v: "compose.agent_memory_loop.v1",
  step: "remember",
  next: [
    "post_turn",
  ],
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `v`                                                                 | *"compose.agent_memory_loop.v1"*                                         | :heavy_check_mark:                                                  | N/A                                                                 |
| `step`                                                              | [models.AgentMemoryLoopStep](../models/agent-memory-loop-step.md)   | :heavy_check_mark:                                                  | N/A                                                                 |
| `next`                                                              | [models.AgentMemoryLoopStep](../models/agent-memory-loop-step.md)[] | :heavy_check_mark:                                                  | N/A                                                                 |
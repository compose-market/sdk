# AgentMemoryContextResponse

## Example Usage

```typescript
import { AgentMemoryContextResponse } from "@compose-market/sdk/models";

let value: AgentMemoryContextResponse = {
  workflow: {
    v: "compose.agent_memory.v1",
    step: "remember",
    next: [
      "pre_turn",
    ],
  },
  contextId: "<id>",
  prompt: "<value>",
  items: [],
  totals: {
    "key": 668253,
    "key1": 146180,
    "key2": 768052,
  },
  contextUsage: {
    characters: 309378,
    rawCharacters: 905274,
    savedCharactersVsRaw: 949747,
    items: 318444,
  },
  omitted: {
    "key": 720422,
    "key1": 791118,
    "key2": 444852,
  },
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `workflow`                                                                        | [models.AgentMemoryWorkflowEnvelope](../models/agent-memory-workflow-envelope.md) | :heavy_check_mark:                                                                | N/A                                                                               |
| `contextId`                                                                       | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `prompt`                                                                          | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `items`                                                                           | [models.AgentMemoryCompactItem](../models/agent-memory-compact-item.md)[]         | :heavy_check_mark:                                                                | N/A                                                                               |
| `totals`                                                                          | Record<string, *number*>                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `contextUsage`                                                                    | [models.AgentMemoryContextUsage](../models/agent-memory-context-usage.md)         | :heavy_check_mark:                                                                | N/A                                                                               |
| `omitted`                                                                         | Record<string, *number*>                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `raw`                                                                             | Record<string, *any*[]>                                                           | :heavy_minus_sign:                                                                | N/A                                                                               |
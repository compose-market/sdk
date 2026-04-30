# AgentMemoryTurnMessage

## Example Usage

```typescript
import { AgentMemoryTurnMessage } from "@compose-market/sdk/models";

let value: AgentMemoryTurnMessage = {
  role: "system",
  content: "<value>",
};
```

## Fields

| Field                                       | Type                                        | Required                                    | Description                                 |
| ------------------------------------------- | ------------------------------------------- | ------------------------------------------- | ------------------------------------------- |
| `role`                                      | [models.Role](../models/role.md)            | :heavy_check_mark:                          | N/A                                         |
| `content`                                   | *string*                                    | :heavy_check_mark:                          | N/A                                         |
| `timestamp`                                 | *number*                                    | :heavy_minus_sign:                          | N/A                                         |
| `toolCalls`                                 | [models.ToolCall](../models/tool-call.md)[] | :heavy_minus_sign:                          | N/A                                         |
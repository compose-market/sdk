# MeshToolExecuteRequest

## Example Usage

```typescript
import { MeshToolExecuteRequest } from "@compose-market/sdk/models";

let value: MeshToolExecuteRequest = {
  agentWallet: "<value>",
  toolName: "search_memory",
  haiId: "<id>",
  threadId: "<id>",
};
```

## Fields

| Field                                     | Type                                      | Required                                  | Description                               |
| ----------------------------------------- | ----------------------------------------- | ----------------------------------------- | ----------------------------------------- |
| `agentWallet`                             | *string*                                  | :heavy_check_mark:                        | N/A                                       |
| `userAddress`                             | *string*                                  | :heavy_minus_sign:                        | N/A                                       |
| `workflowWallet`                          | *string*                                  | :heavy_minus_sign:                        | N/A                                       |
| `toolName`                                | [models.ToolName](../models/tool-name.md) | :heavy_check_mark:                        | N/A                                       |
| `args`                                    | Record<string, *any*>                     | :heavy_minus_sign:                        | N/A                                       |
| `haiId`                                   | *string*                                  | :heavy_check_mark:                        | N/A                                       |
| `threadId`                                | *string*                                  | :heavy_check_mark:                        | N/A                                       |
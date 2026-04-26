# ToolsMcpToolExecuteRequest

## Example Usage

```typescript
import { ToolsMcpToolExecuteRequest } from "@compose-market/sdk/models/operations";

let value: ToolsMcpToolExecuteRequest = {
  serverId: "<id>",
  toolName: "<value>",
  body: {},
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `serverId`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `toolName`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `body`                                                            | [models.ToolExecuteRequest](../../models/tool-execute-request.md) | :heavy_check_mark:                                                | N/A                                                               |
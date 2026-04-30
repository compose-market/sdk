# ToolsGoatToolExecuteRequest

## Example Usage

```typescript
import { ToolsGoatToolExecuteRequest } from "@compose-market/sdk/models/operations";

let value: ToolsGoatToolExecuteRequest = {
  pluginId: "<id>",
  toolName: "<value>",
  body: {},
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `pluginId`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `toolName`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `body`                                                            | [models.ToolExecuteRequest](../../models/tool-execute-request.md) | :heavy_check_mark:                                                | N/A                                                               |
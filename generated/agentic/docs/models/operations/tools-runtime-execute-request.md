# ToolsRuntimeExecuteRequest

## Example Usage

```typescript
import { ToolsRuntimeExecuteRequest } from "@compose-market/sdk/models/operations";

let value: ToolsRuntimeExecuteRequest = {
  source: "goat",
  toolName: "<value>",
};
```

## Fields

| Field                                                  | Type                                                   | Required                                               | Description                                            |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| `source`                                               | [operations.Source](../../models/operations/source.md) | :heavy_check_mark:                                     | N/A                                                    |
| `pluginId`                                             | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `serverId`                                             | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `toolName`                                             | *string*                                               | :heavy_check_mark:                                     | N/A                                                    |
| `args`                                                 | Record<string, *any*>                                  | :heavy_minus_sign:                                     | N/A                                                    |
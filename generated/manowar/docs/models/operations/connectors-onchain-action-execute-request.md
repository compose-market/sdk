# ConnectorsOnchainActionExecuteRequest

## Example Usage

```typescript
import { ConnectorsOnchainActionExecuteRequest } from "@compose-market/sdk/models/operations";

let value: ConnectorsOnchainActionExecuteRequest = {
  pluginId: "<id>",
  actionName: "<value>",
  body: {},
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `pluginId`                                                            | *string*                                                              | :heavy_check_mark:                                                    | N/A                                                                   |
| `actionName`                                                          | *string*                                                              | :heavy_check_mark:                                                    | N/A                                                                   |
| `body`                                                                | [models.ActionExecuteRequest](../../models/action-execute-request.md) | :heavy_check_mark:                                                    | N/A                                                                   |
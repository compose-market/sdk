# ConnectorsMcpActionExecuteRequest

## Example Usage

```typescript
import { ConnectorsMcpActionExecuteRequest } from "@compose-market/sdk/models/operations";

let value: ConnectorsMcpActionExecuteRequest = {
  serverId: "<id>",
  actionName: "<value>",
  body: {},
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `serverId`                                                            | *string*                                                              | :heavy_check_mark:                                                    | N/A                                                                   |
| `actionName`                                                          | *string*                                                              | :heavy_check_mark:                                                    | N/A                                                                   |
| `body`                                                                | [models.ActionExecuteRequest](../../models/action-execute-request.md) | :heavy_check_mark:                                                    | N/A                                                                   |
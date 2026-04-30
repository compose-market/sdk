# WorkflowsChatStreamRequest

## Example Usage

```typescript
import { WorkflowsChatStreamRequest } from "@compose-market/sdk/models/operations";

let value: WorkflowsChatStreamRequest = {
  walletAddress: "<value>",
  body: {
    message: "<value>",
  },
};
```

## Fields

| Field                                                               | Type                                                                | Required                                                            | Description                                                         |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `walletAddress`                                                     | *string*                                                            | :heavy_check_mark:                                                  | N/A                                                                 |
| `xSessionUserAddress`                                               | *string*                                                            | :heavy_minus_sign:                                                  | N/A                                                                 |
| `xSessionActive`                                                    | [models.SessionActiveHeader](../../models/session-active-header.md) | :heavy_minus_sign:                                                  | N/A                                                                 |
| `xSessionBudgetRemaining`                                           | *string*                                                            | :heavy_minus_sign:                                                  | N/A                                                                 |
| `body`                                                              | [models.WorkflowChatRequest](../../models/workflow-chat-request.md) | :heavy_check_mark:                                                  | N/A                                                                 |
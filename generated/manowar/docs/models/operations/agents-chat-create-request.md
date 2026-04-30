# AgentsChatCreateRequest

## Example Usage

```typescript
import { AgentsChatCreateRequest } from "@compose-market/sdk/models/operations";

let value: AgentsChatCreateRequest = {
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
| `body`                                                              | [models.AgentChatRequest](../../models/agent-chat-request.md)       | :heavy_check_mark:                                                  | N/A                                                                 |
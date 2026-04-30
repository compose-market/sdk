# WorkflowsExecuteRequest

## Example Usage

```typescript
import { WorkflowsExecuteRequest } from "@compose-market/sdk/models/operations";

let value: WorkflowsExecuteRequest = {
  body: {
    payload: {
      walletAddress: "<value>",
    },
  },
};
```

## Fields

| Field                                                                                               | Type                                                                                                | Required                                                                                            | Description                                                                                         |
| --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                                               | *string*                                                                                            | :heavy_minus_sign:                                                                                  | N/A                                                                                                 |
| `xSessionActive`                                                                                    | [models.SessionActiveHeader](../../models/session-active-header.md)                                 | :heavy_minus_sign:                                                                                  | N/A                                                                                                 |
| `xSessionBudgetRemaining`                                                                           | *string*                                                                                            | :heavy_minus_sign:                                                                                  | N/A                                                                                                 |
| `body`                                                                                              | [operations.WorkflowsExecuteRequestBody](../../models/operations/workflows-execute-request-body.md) | :heavy_check_mark:                                                                                  | N/A                                                                                                 |
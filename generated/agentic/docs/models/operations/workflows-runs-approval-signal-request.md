# WorkflowsRunsApprovalSignalRequest

## Example Usage

```typescript
import { WorkflowsRunsApprovalSignalRequest } from "@compose-market/sdk/models/operations";

let value: WorkflowsRunsApprovalSignalRequest = {
  walletAddress: "<value>",
  runId: "<id>",
  body: {
    stepKey: "<value>",
    status: "approved",
  },
};
```

## Fields

| Field                                                                                                                       | Type                                                                                                                        | Required                                                                                                                    | Description                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `walletAddress`                                                                                                             | *string*                                                                                                                    | :heavy_check_mark:                                                                                                          | N/A                                                                                                                         |
| `runId`                                                                                                                     | *string*                                                                                                                    | :heavy_check_mark:                                                                                                          | N/A                                                                                                                         |
| `body`                                                                                                                      | [operations.WorkflowsRunsApprovalSignalRequestBody](../../models/operations/workflows-runs-approval-signal-request-body.md) | :heavy_check_mark:                                                                                                          | N/A                                                                                                                         |
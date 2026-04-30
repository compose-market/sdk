# WorkflowsRunsApprovalSignalRequestBody

## Example Usage

```typescript
import { WorkflowsRunsApprovalSignalRequestBody } from "@compose-market/sdk/models/operations";

let value: WorkflowsRunsApprovalSignalRequestBody = {
  stepKey: "<value>",
  status: "rejected",
};
```

## Fields

| Field                                                  | Type                                                   | Required                                               | Description                                            |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| `stepKey`                                              | *string*                                               | :heavy_check_mark:                                     | N/A                                                    |
| `status`                                               | [operations.Status](../../models/operations/status.md) | :heavy_check_mark:                                     | N/A                                                    |
| `approver`                                             | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `reason`                                               | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
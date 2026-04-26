# WorkflowsRunsApprovalSignalResponse

## Example Usage

```typescript
import { WorkflowsRunsApprovalSignalResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsRunsApprovalSignalResponse = {
  contentType: "<value>",
  statusCode: 607837,
};
```

## Fields

| Field                                                                                                                         | Type                                                                                                                          | Required                                                                                                                      | Description                                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `contentType`                                                                                                                 | *string*                                                                                                                      | :heavy_check_mark:                                                                                                            | HTTP response content type for this operation                                                                                 |
| `statusCode`                                                                                                                  | *number*                                                                                                                      | :heavy_check_mark:                                                                                                            | HTTP response status code for this operation                                                                                  |
| `rawResponse`                                                                                                                 | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                                                         | :heavy_check_mark:                                                                                                            | Raw HTTP response; suitable for custom response parsing                                                                       |
| `object`                                                                                                                      | [operations.WorkflowsRunsApprovalSignalResponseBody](../../models/operations/workflows-runs-approval-signal-response-body.md) | :heavy_minus_sign:                                                                                                            | Approval signal accepted.                                                                                                     |
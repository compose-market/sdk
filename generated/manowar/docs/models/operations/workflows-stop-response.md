# WorkflowsStopResponse

## Example Usage

```typescript
import { WorkflowsStopResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsStopResponse = {
  contentType: "<value>",
  statusCode: 870266,
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `contentType`                                                                                   | *string*                                                                                        | :heavy_check_mark:                                                                              | HTTP response content type for this operation                                                   |
| `statusCode`                                                                                    | *number*                                                                                        | :heavy_check_mark:                                                                              | HTTP response status code for this operation                                                    |
| `rawResponse`                                                                                   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                           | :heavy_check_mark:                                                                              | Raw HTTP response; suitable for custom response parsing                                         |
| `object`                                                                                        | [operations.WorkflowsStopResponseBody](../../models/operations/workflows-stop-response-body.md) | :heavy_minus_sign:                                                                              | Workflow cancellation accepted.                                                                 |
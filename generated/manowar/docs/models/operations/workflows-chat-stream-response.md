# WorkflowsChatStreamResponse

## Example Usage

```typescript
import { WorkflowsChatStreamResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsChatStreamResponse = {
  contentType: "<value>",
  statusCode: 508671,
  headers: {
    "key": [
      "<value 1>",
    ],
    "key1": [
      "<value 1>",
    ],
  },
};
```

## Fields

| Field                                                                                            | Type                                                                                             | Required                                                                                         | Description                                                                                      |
| ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `contentType`                                                                                    | *string*                                                                                         | :heavy_check_mark:                                                                               | HTTP response content type for this operation                                                    |
| `statusCode`                                                                                     | *number*                                                                                         | :heavy_check_mark:                                                                               | HTTP response status code for this operation                                                     |
| `rawResponse`                                                                                    | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                            | :heavy_check_mark:                                                                               | Raw HTTP response; suitable for custom response parsing                                          |
| `workflowEventStream`                                                                            | *string*                                                                                         | :heavy_minus_sign:                                                                               | Workflow SSE stream carrying start, step, agent, progress, tool, result, error, and done frames. |
| `headers`                                                                                        | Record<string, *string*[]>                                                                       | :heavy_check_mark:                                                                               | N/A                                                                                              |
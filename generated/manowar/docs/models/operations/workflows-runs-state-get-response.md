# WorkflowsRunsStateGetResponse

## Example Usage

```typescript
import { WorkflowsRunsStateGetResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsRunsStateGetResponse = {
  contentType: "<value>",
  statusCode: 2721,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `object`                                                              | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | Durable workflow run state.                                           |
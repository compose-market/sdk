# WorkflowsRunAliasResponse

## Example Usage

```typescript
import { WorkflowsRunAliasResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsRunAliasResponse = {
  contentType: "<value>",
  statusCode: 871274,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `workflowEventStream`                                                 | *string*                                                              | :heavy_minus_sign:                                                    | Alias for `/workflow/{walletAddress}/chat`.                           |
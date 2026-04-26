# InferenceResponsesInputItemsListResponse

## Example Usage

```typescript
import { InferenceResponsesInputItemsListResponse } from "@compose-market/sdk/models/operations";

let value: InferenceResponsesInputItemsListResponse = {
  contentType: "<value>",
  statusCode: 164276,
};
```

## Fields

| Field                                                                                                                                    | Type                                                                                                                                     | Required                                                                                                                                 | Description                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `contentType`                                                                                                                            | *string*                                                                                                                                 | :heavy_check_mark:                                                                                                                       | HTTP response content type for this operation                                                                                            |
| `statusCode`                                                                                                                             | *number*                                                                                                                                 | :heavy_check_mark:                                                                                                                       | HTTP response status code for this operation                                                                                             |
| `rawResponse`                                                                                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                                                                    | :heavy_check_mark:                                                                                                                       | Raw HTTP response; suitable for custom response parsing                                                                                  |
| `object`                                                                                                                                 | [operations.InferenceResponsesInputItemsListResponseBody](../../models/operations/inference-responses-input-items-list-response-body.md) | :heavy_minus_sign:                                                                                                                       | Stored input items.                                                                                                                      |
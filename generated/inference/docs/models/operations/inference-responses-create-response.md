# InferenceResponsesCreateResponse

## Example Usage

```typescript
import { InferenceResponsesCreateResponse } from "@compose-market/sdk/models/operations";

let value: InferenceResponsesCreateResponse = {
  contentType: "<value>",
  statusCode: 834422,
  headers: {
    "key": [
      "<value 1>",
    ],
  },
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `responseObject`                                                      | [models.ResponseObject](../../models/response-object.md)              | :heavy_minus_sign:                                                    | Response object or SSE stream when `stream` is true.                  |
| `responseEventStream`                                                 | *string*                                                              | :heavy_minus_sign:                                                    | Response object or SSE stream when `stream` is true.                  |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
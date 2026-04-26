# InferenceResponsesCancelResponse

## Example Usage

```typescript
import { InferenceResponsesCancelResponse } from "@compose-market/sdk/models/operations";

let value: InferenceResponsesCancelResponse = {
  contentType: "<value>",
  statusCode: 922302,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `responseObject`                                                      | [models.ResponseObject](../../models/response-object.md)              | :heavy_minus_sign:                                                    | Cancelled response object.                                            |
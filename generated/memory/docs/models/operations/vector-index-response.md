# VectorIndexResponse

## Example Usage

```typescript
import { VectorIndexResponse } from "@compose-market/sdk/models/operations";

let value: VectorIndexResponse = {
  contentType: "<value>",
  statusCode: 67264,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `vectorIndexResponse`                                                 | [models.VectorIndexResponse](../../models/vector-index-response.md)   | :heavy_minus_sign:                                                    | Vector indexing result.                                               |
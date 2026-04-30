# VectorSearchResponse

## Example Usage

```typescript
import { VectorSearchResponse } from "@compose-market/sdk/models/operations";

let value: VectorSearchResponse = {
  contentType: "<value>",
  statusCode: 750926,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `vectorSearchResponse`                                                | [models.VectorSearchResponse](../../models/vector-search-response.md) | :heavy_minus_sign:                                                    | Vector search results.                                                |
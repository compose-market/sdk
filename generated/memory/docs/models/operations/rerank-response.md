# RerankResponse

## Example Usage

```typescript
import { RerankResponse } from "@compose-market/sdk/models/operations";

let value: RerankResponse = {
  contentType: "<value>",
  statusCode: 52137,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `rerankResponse`                                                      | [models.RerankResponse](../../models/rerank-response.md)              | :heavy_minus_sign:                                                    | Reranked memory documents.                                            |
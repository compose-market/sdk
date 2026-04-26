# MemoryVectorSearchResponse

## Example Usage

```typescript
import { MemoryVectorSearchResponse } from "@compose-market/sdk/models/operations";

let value: MemoryVectorSearchResponse = {
  contentType: "<value>",
  statusCode: 480589,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `jsonObjectResponse`                                                  | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | JSON object response.                                                 |
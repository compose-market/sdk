# LayersSearchResponse

## Example Usage

```typescript
import { LayersSearchResponse } from "@compose-market/sdk/models/operations";

let value: LayersSearchResponse = {
  contentType: "<value>",
  statusCode: 432793,
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contentType`                                                           | *string*                                                                | :heavy_check_mark:                                                      | HTTP response content type for this operation                           |
| `statusCode`                                                            | *number*                                                                | :heavy_check_mark:                                                      | HTTP response status code for this operation                            |
| `rawResponse`                                                           | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)   | :heavy_check_mark:                                                      | Raw HTTP response; suitable for custom response parsing                 |
| `layeredSearchResponse`                                                 | [models.LayeredSearchResponse](../../models/layered-search-response.md) | :heavy_minus_sign:                                                      | Layered memory search result.                                           |
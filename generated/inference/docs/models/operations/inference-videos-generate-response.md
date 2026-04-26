# InferenceVideosGenerateResponse

## Example Usage

```typescript
import { InferenceVideosGenerateResponse } from "@compose-market/sdk/models/operations";

let value: InferenceVideosGenerateResponse = {
  contentType: "<value>",
  statusCode: 807683,
  headers: {
    "key": [
      "<value 1>",
    ],
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contentType`                                                           | *string*                                                                | :heavy_check_mark:                                                      | HTTP response content type for this operation                           |
| `statusCode`                                                            | *number*                                                                | :heavy_check_mark:                                                      | HTTP response status code for this operation                            |
| `rawResponse`                                                           | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)   | :heavy_check_mark:                                                      | Raw HTTP response; suitable for custom response parsing                 |
| `videoGenerateResponse`                                                 | [models.VideoGenerateResponse](../../models/video-generate-response.md) | :heavy_minus_sign:                                                      | Completed video generation result.                                      |
| `headers`                                                               | Record<string, *string*[]>                                              | :heavy_check_mark:                                                      | N/A                                                                     |
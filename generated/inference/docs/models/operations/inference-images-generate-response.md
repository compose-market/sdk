# InferenceImagesGenerateResponse

## Example Usage

```typescript
import { InferenceImagesGenerateResponse } from "@compose-market/sdk/models/operations";

let value: InferenceImagesGenerateResponse = {
  contentType: "<value>",
  statusCode: 241489,
  headers: {
    "key": [
      "<value 1>",
      "<value 2>",
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
| `imagesResponse`                                                      | [models.ImagesResponse](../../models/images-response.md)              | :heavy_minus_sign:                                                    | Image generation response.                                            |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
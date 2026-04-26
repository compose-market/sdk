# InferenceImagesEditResponse

## Example Usage

```typescript
import { InferenceImagesEditResponse } from "@compose-market/sdk/models/operations";

let value: InferenceImagesEditResponse = {
  contentType: "<value>",
  statusCode: 925148,
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
| `imagesResponse`                                                      | [models.ImagesResponse](../../models/images-response.md)              | :heavy_minus_sign:                                                    | Image edit response.                                                  |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
# InferenceVideosGetResponse

## Example Usage

```typescript
import { InferenceVideosGetResponse } from "@compose-market/sdk/models/operations";

let value: InferenceVideosGetResponse = {
  contentType: "<value>",
  statusCode: 673011,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `videoJobStatus`                                                      | [models.VideoJobStatus](../../models/video-job-status.md)             | :heavy_minus_sign:                                                    | Video job status.                                                     |
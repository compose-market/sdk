# InferenceAudioTranscriptionsCreateMultipartResponse

## Example Usage

```typescript
import { InferenceAudioTranscriptionsCreateMultipartResponse } from "@compose-market/sdk/models/operations";

let value: InferenceAudioTranscriptionsCreateMultipartResponse = {
  contentType: "<value>",
  statusCode: 997746,
  headers: {},
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `contentType`                                                                     | *string*                                                                          | :heavy_check_mark:                                                                | HTTP response content type for this operation                                     |
| `statusCode`                                                                      | *number*                                                                          | :heavy_check_mark:                                                                | HTTP response status code for this operation                                      |
| `rawResponse`                                                                     | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)             | :heavy_check_mark:                                                                | Raw HTTP response; suitable for custom response parsing                           |
| `audioTranscriptionResponse`                                                      | [models.AudioTranscriptionResponse](../../models/audio-transcription-response.md) | :heavy_minus_sign:                                                                | Transcription result.                                                             |
| `headers`                                                                         | Record<string, *string*[]>                                                        | :heavy_check_mark:                                                                | N/A                                                                               |
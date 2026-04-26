# InferenceAudioSpeechCreateResponse

## Example Usage

```typescript
import { InferenceAudioSpeechCreateResponse } from "@compose-market/sdk/models/operations";

// No examples available for this model
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `twoHundredApplicationOctetStreamResponseStream`                      | *ReadableStream<Uint8Array>*                                          | :heavy_minus_sign:                                                    | Audio bytes.                                                          |
| `twoHundredAudioMpegResponseStream`                                   | *ReadableStream<Uint8Array>*                                          | :heavy_minus_sign:                                                    | Audio bytes.                                                          |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
# InferenceAudioTranscriptionsCreateRequest

## Example Usage

```typescript
import { InferenceAudioTranscriptionsCreateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceAudioTranscriptionsCreateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Mustang",
    file: "<value>",
  },
};
```

## Fields

| Field                                                                                        | Type                                                                                         | Required                                                                                     | Description                                                                                  | Example                                                                                      |
| -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                                        | *string*                                                                                     | :heavy_minus_sign:                                                                           | N/A                                                                                          | 0x1111111111111111111111111111111111111111                                                   |
| `xChainId`                                                                                   | *number*                                                                                     | :heavy_minus_sign:                                                                           | N/A                                                                                          |                                                                                              |
| `xX402MaxAmountWei`                                                                          | *string*                                                                                     | :heavy_minus_sign:                                                                           | N/A                                                                                          | 1000000                                                                                      |
| `body`                                                                                       | [models.AudioTranscriptionCreateRequest](../../models/audio-transcription-create-request.md) | :heavy_check_mark:                                                                           | N/A                                                                                          |                                                                                              |
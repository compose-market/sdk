# InferenceAudioSpeechCreateRequest

## Example Usage

```typescript
import { InferenceAudioSpeechCreateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceAudioSpeechCreateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Camaro",
    input: "<value>",
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    | Example                                                                        |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `xSessionUserAddress`                                                          | *string*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            | 0x1111111111111111111111111111111111111111                                     |
| `xChainId`                                                                     | *number*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            |                                                                                |
| `xX402MaxAmountWei`                                                            | *string*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            | 1000000                                                                        |
| `body`                                                                         | [models.AudioSpeechCreateRequest](../../models/audio-speech-create-request.md) | :heavy_check_mark:                                                             | N/A                                                                            |                                                                                |
# InferenceVideosGenerateRequest

## Example Usage

```typescript
import { InferenceVideosGenerateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceVideosGenerateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Volt",
  },
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           | Example                                                               |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `xSessionUserAddress`                                                 | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   | 0x1111111111111111111111111111111111111111                            |
| `xChainId`                                                            | *number*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   |                                                                       |
| `xX402MaxAmountWei`                                                   | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   | 1000000                                                               |
| `body`                                                                | [models.VideoGenerateRequest](../../models/video-generate-request.md) | :heavy_check_mark:                                                    | N/A                                                                   |                                                                       |
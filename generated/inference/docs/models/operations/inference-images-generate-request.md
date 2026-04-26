# InferenceImagesGenerateRequest

## Example Usage

```typescript
import { InferenceImagesGenerateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceImagesGenerateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Grand Cherokee",
    prompt: "<value>",
  },
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             | Example                                                                 |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `xSessionUserAddress`                                                   | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     | 0x1111111111111111111111111111111111111111                              |
| `xChainId`                                                              | *number*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     |                                                                         |
| `xX402MaxAmountWei`                                                     | *string*                                                                | :heavy_minus_sign:                                                      | N/A                                                                     | 1000000                                                                 |
| `body`                                                                  | [models.ImagesGenerateRequest](../../models/images-generate-request.md) | :heavy_check_mark:                                                      | N/A                                                                     |                                                                         |
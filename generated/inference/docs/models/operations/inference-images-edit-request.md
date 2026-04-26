# InferenceImagesEditRequest

## Example Usage

```typescript
import { InferenceImagesEditRequest } from "@compose-market/sdk/models/operations";

let value: InferenceImagesEditRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "F-150",
    prompt: "<value>",
  },
};
```

## Fields

| Field                                                                                                      | Type                                                                                                       | Required                                                                                                   | Description                                                                                                | Example                                                                                                    |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                                                      | *string*                                                                                                   | :heavy_minus_sign:                                                                                         | N/A                                                                                                        | 0x1111111111111111111111111111111111111111                                                                 |
| `xChainId`                                                                                                 | *number*                                                                                                   | :heavy_minus_sign:                                                                                         | N/A                                                                                                        |                                                                                                            |
| `xX402MaxAmountWei`                                                                                        | *string*                                                                                                   | :heavy_minus_sign:                                                                                         | N/A                                                                                                        | 1000000                                                                                                    |
| `body`                                                                                                     | [operations.InferenceImagesEditRequestBody](../../models/operations/inference-images-edit-request-body.md) | :heavy_check_mark:                                                                                         | N/A                                                                                                        |                                                                                                            |
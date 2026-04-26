# InferenceImagesEditRequestBody

## Example Usage

```typescript
import { InferenceImagesEditRequestBody } from "@compose-market/sdk/models/operations";

let value: InferenceImagesEditRequestBody = {
  model: "Prius",
  prompt: "<value>",
};
```

## Fields

| Field                                                  | Type                                                   | Required                                               | Description                                            |
| ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------------ |
| `model`                                                | *string*                                               | :heavy_check_mark:                                     | N/A                                                    |
| `prompt`                                               | *string*                                               | :heavy_check_mark:                                     | N/A                                                    |
| `n`                                                    | *number*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `size`                                                 | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `quality`                                              | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `provider`                                             | [models.ModelProvider](../../models/model-provider.md) | :heavy_minus_sign:                                     | N/A                                                    |
| `image`                                                | *string*                                               | :heavy_minus_sign:                                     | N/A                                                    |
| `additionalProperties`                                 | Record<string, *any*>                                  | :heavy_minus_sign:                                     | N/A                                                    |
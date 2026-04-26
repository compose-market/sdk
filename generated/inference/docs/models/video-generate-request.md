# VideoGenerateRequest

## Example Usage

```typescript
import { VideoGenerateRequest } from "@compose-market/sdk/models";

let value: VideoGenerateRequest = {
  model: "1",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `prompt`                                            | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `duration`                                          | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `aspectRatio`                                       | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `resolution`                                        | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `imageUrl`                                          | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
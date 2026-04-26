# ImagesGenerateRequest

## Example Usage

```typescript
import { ImagesGenerateRequest } from "@compose-market/sdk/models";

let value: ImagesGenerateRequest = {
  model: "Colorado",
  prompt: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `prompt`                                            | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `n`                                                 | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `size`                                              | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `quality`                                           | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
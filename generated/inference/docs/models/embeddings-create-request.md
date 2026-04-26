# EmbeddingsCreateRequest

## Example Usage

```typescript
import { EmbeddingsCreateRequest } from "@compose-market/sdk/models";

let value: EmbeddingsCreateRequest = {
  model: "Accord",
  input: [
    "<value 1>",
  ],
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `input`                                             | *models.Input*                                      | :heavy_check_mark:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `dimensions`                                        | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
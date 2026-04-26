# Model

## Example Usage

```typescript
import { Model } from "@compose-market/sdk/models";

let value: Model = {
  modelId: "<id>",
  provider: "vertex",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `modelId`                                           | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `name`                                              | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_check_mark:                                  | N/A                                                 |
| `type`                                              | *models.ModelType*                                  | :heavy_minus_sign:                                  | N/A                                                 |
| `description`                                       | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `input`                                             | *any*                                               | :heavy_minus_sign:                                  | N/A                                                 |
| `output`                                            | *any*                                               | :heavy_minus_sign:                                  | N/A                                                 |
| `contextWindow`                                     | *any*                                               | :heavy_minus_sign:                                  | N/A                                                 |
| `pricing`                                           | *any*                                               | :heavy_minus_sign:                                  | N/A                                                 |
| `maxOutputTokens`                                   | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `capabilities`                                      | *string*[]                                          | :heavy_minus_sign:                                  | N/A                                                 |
| `ownedBy`                                           | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `createdAt`                                         | *models.ModelCreatedAt*                             | :heavy_minus_sign:                                  | N/A                                                 |
| `available`                                         | *boolean*                                           | :heavy_minus_sign:                                  | N/A                                                 |
| `availableFrom`                                     | *string*[]                                          | :heavy_minus_sign:                                  | N/A                                                 |
| `hfInferenceProvider`                               | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `hfProviderId`                                      | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
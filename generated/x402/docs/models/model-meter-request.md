# ModelMeterRequest

## Example Usage

```typescript
import { ModelMeterRequest } from "@compose-market/sdk/models";

let value: ModelMeterRequest = {
  modelId: "<id>",
  modality: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `modelId`                                           | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `modality`                                          | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `usage`                                             | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
| `media`                                             | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
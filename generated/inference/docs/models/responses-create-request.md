# ResponsesCreateRequest

## Example Usage

```typescript
import { ResponsesCreateRequest } from "@compose-market/sdk/models";

let value: ResponsesCreateRequest = {
  model: "Model T",
  input: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `input`                                             | *any*                                               | :heavy_check_mark:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `stream`                                            | *boolean*                                           | :heavy_minus_sign:                                  | N/A                                                 |
| `modalities`                                        | [models.Modality](../models/modality.md)[]          | :heavy_minus_sign:                                  | N/A                                                 |
| `instructions`                                      | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `previousResponseId`                                | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
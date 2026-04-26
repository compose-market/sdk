# AudioTranscriptionCreateRequest

## Example Usage

```typescript
import { AudioTranscriptionCreateRequest } from "@compose-market/sdk/models";

let value: AudioTranscriptionCreateRequest = {
  model: "A8",
  file: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `file`                                              | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `filename`                                          | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `language`                                          | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `responseFormat`                                    | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
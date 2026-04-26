# AudioSpeechCreateRequest

## Example Usage

```typescript
import { AudioSpeechCreateRequest } from "@compose-market/sdk/models";

let value: AudioSpeechCreateRequest = {
  model: "Explorer",
  input: "<value>",
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `input`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `voice`                                             | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `responseFormat`                                    | *string*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `speed`                                             | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
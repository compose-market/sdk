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

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `model`                                                   | *string*                                                  | :heavy_check_mark:                                        | N/A                                                       |
| `input`                                                   | *any*                                                     | :heavy_check_mark:                                        | N/A                                                       |
| `attachments`                                             | *models.AttachmentInput*[]                                | :heavy_minus_sign:                                        | N/A                                                       |
| `attachment`                                              | *models.AttachmentInput*                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `stream`                                                  | *boolean*                                                 | :heavy_minus_sign:                                        | N/A                                                       |
| `modalities`                                              | [models.Modality](../models/modality.md)[]                | :heavy_minus_sign:                                        | N/A                                                       |
| `instructions`                                            | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `previousResponseId`                                      | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `maxOutputTokens`                                         | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `temperature`                                             | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `tools`                                                   | Record<string, *any*>[]                                   | :heavy_minus_sign:                                        | N/A                                                       |
| `toolChoice`                                              | *any*                                                     | :heavy_minus_sign:                                        | N/A                                                       |
| `responseFormat`                                          | [models.ResponseFormat](../models/response-format.md)     | :heavy_minus_sign:                                        | N/A                                                       |
| `streamOptions`                                           | [models.StreamOptions](../models/stream-options.md)       | :heavy_minus_sign:                                        | N/A                                                       |
| `parallelToolCalls`                                       | *boolean*                                                 | :heavy_minus_sign:                                        | N/A                                                       |
| `metadata`                                                | Record<string, *any*>                                     | :heavy_minus_sign:                                        | N/A                                                       |
| `serviceTier`                                             | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `store`                                                   | *boolean*                                                 | :heavy_minus_sign:                                        | N/A                                                       |
| `reasoningEffort`                                         | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `reasoning`                                               | [models.ReasoningOptions](../models/reasoning-options.md) | :heavy_minus_sign:                                        | N/A                                                       |
| `include`                                                 | *string*[]                                                | :heavy_minus_sign:                                        | N/A                                                       |
| `promptCacheKey`                                          | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `promptCacheRetention`                                    | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `text`                                                    | Record<string, *any*>                                     | :heavy_minus_sign:                                        | N/A                                                       |
| `n`                                                       | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `size`                                                    | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `quality`                                                 | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `imageUrl`                                                | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `voice`                                                   | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `language`                                                | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `speed`                                                   | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `duration`                                                | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `aspectRatio`                                             | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `resolution`                                              | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `additionalProperties`                                    | Record<string, *any*>                                     | :heavy_minus_sign:                                        | N/A                                                       |
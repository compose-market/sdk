# ChatCompletionsCreateRequest

## Example Usage

```typescript
import { ChatCompletionsCreateRequest } from "@compose-market/sdk/models";

let value: ChatCompletionsCreateRequest = {
  model: "Ranchero",
  messages: [],
};
```

## Fields

| Field                                                     | Type                                                      | Required                                                  | Description                                               |
| --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------------------------- |
| `model`                                                   | *string*                                                  | :heavy_check_mark:                                        | N/A                                                       |
| `provider`                                                | [models.ModelProvider](../models/model-provider.md)       | :heavy_minus_sign:                                        | N/A                                                       |
| `stream`                                                  | *boolean*                                                 | :heavy_minus_sign:                                        | N/A                                                       |
| `messages`                                                | [models.ChatMessage](../models/chat-message.md)[]         | :heavy_check_mark:                                        | N/A                                                       |
| `attachments`                                             | *models.ComposeAttachmentInput*[]                         | :heavy_minus_sign:                                        | N/A                                                       |
| `attachment`                                              | *models.ComposeAttachmentInput*                           | :heavy_minus_sign:                                        | N/A                                                       |
| `temperature`                                             | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `topP`                                                    | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `n`                                                       | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `stop`                                                    | *models.Stop*                                             | :heavy_minus_sign:                                        | N/A                                                       |
| `maxTokens`                                               | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `maxCompletionTokens`                                     | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `presencePenalty`                                         | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `frequencyPenalty`                                        | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `logitBias`                                               | Record<string, *number*>                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `user`                                                    | *string*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
| `tools`                                                   | Record<string, *any*>[]                                   | :heavy_minus_sign:                                        | N/A                                                       |
| `toolChoice`                                              | *any*                                                     | :heavy_minus_sign:                                        | N/A                                                       |
| `responseFormat`                                          | [models.ResponseFormat](../models/response-format.md)     | :heavy_minus_sign:                                        | N/A                                                       |
| `seed`                                                    | *number*                                                  | :heavy_minus_sign:                                        | N/A                                                       |
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
| `additionalProperties`                                    | Record<string, *any*>                                     | :heavy_minus_sign:                                        | N/A                                                       |
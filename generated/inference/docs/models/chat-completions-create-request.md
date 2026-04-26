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

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `model`                                             | *string*                                            | :heavy_check_mark:                                  | N/A                                                 |
| `provider`                                          | [models.ModelProvider](../models/model-provider.md) | :heavy_minus_sign:                                  | N/A                                                 |
| `stream`                                            | *boolean*                                           | :heavy_minus_sign:                                  | N/A                                                 |
| `messages`                                          | [models.ChatMessage](../models/chat-message.md)[]   | :heavy_check_mark:                                  | N/A                                                 |
| `temperature`                                       | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `maxTokens`                                         | *number*                                            | :heavy_minus_sign:                                  | N/A                                                 |
| `tools`                                             | Record<string, *any*>[]                             | :heavy_minus_sign:                                  | N/A                                                 |
| `toolChoice`                                        | *any*                                               | :heavy_minus_sign:                                  | N/A                                                 |
| `additionalProperties`                              | Record<string, *any*>                               | :heavy_minus_sign:                                  | N/A                                                 |
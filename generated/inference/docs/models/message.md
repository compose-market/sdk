# Message

## Example Usage

```typescript
import { Message } from "@compose-market/sdk/models";

let value: Message = {
  role: "assistant",
  content: "<value>",
};
```

## Fields

| Field                            | Type                             | Required                         | Description                      |
| -------------------------------- | -------------------------------- | -------------------------------- | -------------------------------- |
| `role`                           | [models.Role](../models/role.md) | :heavy_check_mark:               | N/A                              |
| `content`                        | *models.Content*                 | :heavy_check_mark:               | N/A                              |
| `name`                           | *string*                         | :heavy_minus_sign:               | N/A                              |
| `toolCallId`                     | *string*                         | :heavy_minus_sign:               | N/A                              |
| `toolCalls`                      | Record<string, *any*>[]          | :heavy_minus_sign:               | N/A                              |
| `additionalProperties`           | Record<string, *any*>            | :heavy_minus_sign:               | N/A                              |
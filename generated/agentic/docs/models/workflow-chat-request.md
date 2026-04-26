# WorkflowChatRequest

## Example Usage

```typescript
import { WorkflowChatRequest } from "@compose-market/sdk/models";

let value: WorkflowChatRequest = {
  message: "<value>",
};
```

## Fields

| Field                  | Type                   | Required               | Description            |
| ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| `message`              | *string*               | :heavy_check_mark:     | N/A                    |
| `threadId`             | *string*               | :heavy_minus_sign:     | N/A                    |
| `image`                | *string*               | :heavy_minus_sign:     | N/A                    |
| `audio`                | *string*               | :heavy_minus_sign:     | N/A                    |
| `attachment`           | Record<string, *any*>  | :heavy_minus_sign:     | N/A                    |
| `continuous`           | *boolean*              | :heavy_minus_sign:     | N/A                    |
| `composeRunId`         | *string*               | :heavy_minus_sign:     | N/A                    |
| `lastEventIndex`       | *number*               | :heavy_minus_sign:     | N/A                    |
| `additionalProperties` | Record<string, *any*>  | :heavy_minus_sign:     | N/A                    |
# AgentMemoryToolEvent

## Example Usage

```typescript
import { AgentMemoryToolEvent } from "@compose-market/sdk/models";

let value: AgentMemoryToolEvent = {
  name: "<value>",
};
```

## Fields

| Field                 | Type                  | Required              | Description           |
| --------------------- | --------------------- | --------------------- | --------------------- |
| `name`                | *string*              | :heavy_check_mark:    | N/A                   |
| `toolName`            | *string*              | :heavy_minus_sign:    | N/A                   |
| `tool`                | *string*              | :heavy_minus_sign:    | N/A                   |
| `args`                | Record<string, *any*> | :heavy_minus_sign:    | N/A                   |
| `input`               | Record<string, *any*> | :heavy_minus_sign:    | N/A                   |
| `result`              | *string*              | :heavy_minus_sign:    | N/A                   |
| `output`              | *string*              | :heavy_minus_sign:    | N/A                   |
| `status`              | *string*              | :heavy_minus_sign:    | N/A                   |
| `timestamp`           | *number*              | :heavy_minus_sign:    | N/A                   |
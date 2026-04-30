# ToolCall

## Example Usage

```typescript
import { ToolCall } from "@compose-market/sdk/models";

let value: ToolCall = {
  name: "<value>",
  args: {
    "key": "<value>",
  },
};
```

## Fields

| Field                 | Type                  | Required              | Description           |
| --------------------- | --------------------- | --------------------- | --------------------- |
| `name`                | *string*              | :heavy_check_mark:    | N/A                   |
| `args`                | Record<string, *any*> | :heavy_check_mark:    | N/A                   |
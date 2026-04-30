# WorkingMemory

## Example Usage

```typescript
import { WorkingMemory } from "@compose-market/sdk/models";

let value: WorkingMemory = {
  context: [
    "<value 1>",
  ],
  entities: {
    "key": "<value>",
  },
  state: {},
};
```

## Fields

| Field                 | Type                  | Required              | Description           |
| --------------------- | --------------------- | --------------------- | --------------------- |
| `context`             | *string*[]            | :heavy_check_mark:    | N/A                   |
| `entities`            | Record<string, *any*> | :heavy_check_mark:    | N/A                   |
| `state`               | Record<string, *any*> | :heavy_check_mark:    | N/A                   |
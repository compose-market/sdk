# InferenceResponsesInputItemsListResponseBody

Stored input items.

## Example Usage

```typescript
import { InferenceResponsesInputItemsListResponseBody } from "@compose-market/sdk/models/operations";

let value: InferenceResponsesInputItemsListResponseBody = {
  object: "list",
  data: [
    {
      "key": "<value>",
    },
    {},
    {
      "key": "<value>",
      "key1": "<value>",
      "key2": "<value>",
    },
  ],
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `object`                | *"list"*                | :heavy_check_mark:      | N/A                     |
| `data`                  | Record<string, *any*>[] | :heavy_check_mark:      | N/A                     |
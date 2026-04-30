# MemoryRememberedItem

## Example Usage

```typescript
import { MemoryRememberedItem } from "@compose-market/sdk/models";

let value: MemoryRememberedItem = {
  text: "<value>",
  type: "<value>",
  status: "active",
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `id`                                                                            | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `text`                                                                          | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `type`                                                                          | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `retention`                                                                     | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `confidence`                                                                    | *number*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `status`                                                                        | [models.MemoryRememberedItemStatus](../models/memory-remembered-item-status.md) | :heavy_check_mark:                                                              | N/A                                                                             |
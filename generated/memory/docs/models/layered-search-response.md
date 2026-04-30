# LayeredSearchResponse

## Example Usage

```typescript
import { LayeredSearchResponse } from "@compose-market/sdk/models";

let value: LayeredSearchResponse = {
  query: "<value>",
  layers: {
    "key": [],
  },
  totals: {},
};
```

## Fields

| Field                    | Type                     | Required                 | Description              |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |
| `query`                  | *string*                 | :heavy_check_mark:       | N/A                      |
| `layers`                 | Record<string, *any*[]>  | :heavy_check_mark:       | N/A                      |
| `totals`                 | Record<string, *number*> | :heavy_check_mark:       | N/A                      |
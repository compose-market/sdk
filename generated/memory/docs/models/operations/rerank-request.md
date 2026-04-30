# RerankRequest

## Example Usage

```typescript
import { RerankRequest } from "@compose-market/sdk/models/operations";

let value: RerankRequest = {
  query: "<value>",
  documents: [
    {
      "key": "<value>",
      "key1": "<value>",
    },
    {},
    {},
  ],
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `query`                 | *string*                | :heavy_check_mark:      | N/A                     |
| `documents`             | Record<string, *any*>[] | :heavy_check_mark:      | N/A                     |
| `topK`                  | *number*                | :heavy_minus_sign:      | N/A                     |
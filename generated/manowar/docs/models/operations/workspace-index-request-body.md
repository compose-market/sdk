# WorkspaceIndexRequestBody

## Example Usage

```typescript
import { WorkspaceIndexRequestBody } from "@compose-market/sdk/models/operations";

let value: WorkspaceIndexRequestBody = {
  agentWallet: "<value>",
  documents: [
    {
      "key": "<value>",
    },
  ],
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `agentWallet`           | *string*                | :heavy_check_mark:      | N/A                     |
| `documents`             | Record<string, *any*>[] | :heavy_check_mark:      | N/A                     |
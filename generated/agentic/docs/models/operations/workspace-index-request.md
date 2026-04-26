# WorkspaceIndexRequest

## Example Usage

```typescript
import { WorkspaceIndexRequest } from "@compose-market/sdk/models/operations";

let value: WorkspaceIndexRequest = {
  body: {
    agentWallet: "<value>",
    documents: [
      {},
      {},
      {
        "key": "<value>",
      },
    ],
  },
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                                           | *string*                                                                                        | :heavy_minus_sign:                                                                              | N/A                                                                                             |
| `xSessionActive`                                                                                | [models.SessionActiveHeader](../../models/session-active-header.md)                             | :heavy_minus_sign:                                                                              | N/A                                                                                             |
| `body`                                                                                          | [operations.WorkspaceIndexRequestBody](../../models/operations/workspace-index-request-body.md) | :heavy_check_mark:                                                                              | N/A                                                                                             |
# WorkspaceSearchRequest

## Example Usage

```typescript
import { WorkspaceSearchRequest } from "@compose-market/sdk/models/operations";

let value: WorkspaceSearchRequest = {
  body: {
    agentWallet: "<value>",
    query: "<value>",
  },
};
```

## Fields

| Field                                                                                             | Type                                                                                              | Required                                                                                          | Description                                                                                       |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                                             | *string*                                                                                          | :heavy_minus_sign:                                                                                | N/A                                                                                               |
| `xSessionActive`                                                                                  | [models.SessionActiveHeader](../../models/session-active-header.md)                               | :heavy_minus_sign:                                                                                | N/A                                                                                               |
| `body`                                                                                            | [operations.WorkspaceSearchRequestBody](../../models/operations/workspace-search-request-body.md) | :heavy_check_mark:                                                                                | N/A                                                                                               |
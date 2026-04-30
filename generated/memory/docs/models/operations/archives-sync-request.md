# ArchivesSyncRequest

## Example Usage

```typescript
import { ArchivesSyncRequest } from "@compose-market/sdk/models/operations";

let value: ArchivesSyncRequest = {
  archiveId: "<id>",
  body: {
    agentWallet: "<value>",
  },
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `archiveId`                                                       | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `body`                                                            | [models.ArchiveSyncRequest](../../models/archive-sync-request.md) | :heavy_check_mark:                                                | N/A                                                               |
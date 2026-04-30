# WorkingSessionUpdateResponse

## Example Usage

```typescript
import { WorkingSessionUpdateResponse } from "@compose-market/sdk/models";

let value: WorkingSessionUpdateResponse = {
  success: true,
  session: {
    sessionId: "<id>",
    agentWallet: "<value>",
    workingMemory: {
      context: [
        "<value 1>",
        "<value 2>",
      ],
      entities: {
        "key": "<value>",
      },
      state: {
        "key": "Idaho",
        "key1": "Hawaii",
      },
    },
    compressed: false,
    createdAt: 594830,
    expiresAt: 758525,
    lastAccessedAt: 835890,
  },
};
```

## Fields

| Field                                               | Type                                                | Required                                            | Description                                         |
| --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- |
| `success`                                           | *boolean*                                           | :heavy_check_mark:                                  | N/A                                                 |
| `session`                                           | [models.SessionMemory](../models/session-memory.md) | :heavy_check_mark:                                  | N/A                                                 |
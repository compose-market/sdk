# SessionsWorkingUpdateRequest

## Example Usage

```typescript
import { SessionsWorkingUpdateRequest } from "@compose-market/sdk/models/operations";

let value: SessionsWorkingUpdateRequest = {
  sessionId: "<id>",
  body: {
    agentWallet: "<value>",
  },
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `sessionId`                                                                          | *string*                                                                             | :heavy_check_mark:                                                                   | N/A                                                                                  |
| `body`                                                                               | [models.WorkingSessionUpdateRequest](../../models/working-session-update-request.md) | :heavy_check_mark:                                                                   | N/A                                                                                  |
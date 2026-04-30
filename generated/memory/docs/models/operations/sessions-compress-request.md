# SessionsCompressRequest

## Example Usage

```typescript
import { SessionsCompressRequest } from "@compose-market/sdk/models/operations";

let value: SessionsCompressRequest = {
  sessionId: "<id>",
  body: {
    agentWallet: "<value>",
    coordinatorModel: "<value>",
  },
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `sessionId`                                                               | *string*                                                                  | :heavy_check_mark:                                                        | N/A                                                                       |
| `body`                                                                    | [models.SessionCompressRequest](../../models/session-compress-request.md) | :heavy_check_mark:                                                        | N/A                                                                       |
# WorkingSessionUpdateRequest

## Example Usage

```typescript
import { WorkingSessionUpdateRequest } from "@compose-market/sdk/models";

let value: WorkingSessionUpdateRequest = {
  agentWallet: "<value>",
};
```

## Fields

| Field                                                                                      | Type                                                                                       | Required                                                                                   | Description                                                                                |
| ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `agentWallet`                                                                              | *string*                                                                                   | :heavy_check_mark:                                                                         | N/A                                                                                        |
| `userAddress`                                                                              | *string*                                                                                   | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `threadId`                                                                                 | *string*                                                                                   | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `mode`                                                                                     | [models.WorkingSessionUpdateRequestMode](../models/working-session-update-request-mode.md) | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `haiId`                                                                                    | *string*                                                                                   | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `context`                                                                                  | *string*[]                                                                                 | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `entities`                                                                                 | Record<string, *any*>                                                                      | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `state`                                                                                    | Record<string, *any*>                                                                      | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `metadata`                                                                                 | Record<string, *any*>                                                                      | :heavy_minus_sign:                                                                         | N/A                                                                                        |
| `replace`                                                                                  | *boolean*                                                                                  | :heavy_minus_sign:                                                                         | N/A                                                                                        |
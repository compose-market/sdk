# AgentChatRequest

## Example Usage

```typescript
import { AgentChatRequest } from "@compose-market/sdk/models";

let value: AgentChatRequest = {
  message: "<value>",
};
```

## Fields

| Field                   | Type                    | Required                | Description             |
| ----------------------- | ----------------------- | ----------------------- | ----------------------- |
| `message`               | *string*                | :heavy_check_mark:      | N/A                     |
| `threadId`              | *string*                | :heavy_minus_sign:      | N/A                     |
| `composeRunId`          | *string*                | :heavy_minus_sign:      | N/A                     |
| `workflowWallet`        | *string*                | :heavy_minus_sign:      | N/A                     |
| `userAddress`           | *string*                | :heavy_minus_sign:      | N/A                     |
| `attachment`            | Record<string, *any*>   | :heavy_minus_sign:      | N/A                     |
| `sessionGrants`         | *string*[]              | :heavy_minus_sign:      | N/A                     |
| `cloudPermissions`      | *string*[]              | :heavy_minus_sign:      | N/A                     |
| `backpackAccounts`      | Record<string, *any*>[] | :heavy_minus_sign:      | N/A                     |
| `additionalProperties`  | Record<string, *any*>   | :heavy_minus_sign:      | N/A                     |
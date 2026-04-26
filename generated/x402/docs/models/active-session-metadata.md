# ActiveSessionMetadata

## Example Usage

```typescript
import { ActiveSessionMetadata } from "@compose-market/sdk/models";

let value: ActiveSessionMetadata = {
  hasSession: false,
  budgetLimit: "1000000",
  budgetUsed: "1000000",
  budgetLocked: "1000000",
  budgetRemaining: "1000000",
};
```

## Fields

| Field                                             | Type                                              | Required                                          | Description                                       | Example                                           |
| ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `hasSession`                                      | *boolean*                                         | :heavy_check_mark:                                | N/A                                               |                                                   |
| `reason`                                          | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `keyId`                                           | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `budgetLimit`                                     | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `budgetUsed`                                      | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `budgetLocked`                                    | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `budgetRemaining`                                 | *string*                                          | :heavy_minus_sign:                                | Non-negative integer amount in USDC atomic units. | 1000000                                           |
| `expiresAt`                                       | *number*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `chainId`                                         | *number*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `name`                                            | *string*                                          | :heavy_minus_sign:                                | N/A                                               |                                                   |
| `status`                                          | Record<string, *any*>                             | :heavy_minus_sign:                                | N/A                                               |                                                   |
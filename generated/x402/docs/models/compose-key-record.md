# ComposeKeyRecord

## Example Usage

```typescript
import { ComposeKeyRecord } from "@compose-market/sdk/models";

let value: ComposeKeyRecord = {
  keyId: "<id>",
  purpose: "session",
  budgetLimit: "1000000",
  budgetUsed: "1000000",
  budgetReserved: "1000000",
  budgetRemaining: "1000000",
  createdAt: 839601,
  expiresAt: 470282,
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  | Example                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `keyId`                                                      | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `purpose`                                                    | [models.ComposeKeyPurpose](../models/compose-key-purpose.md) | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `budgetLimit`                                                | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `budgetUsed`                                                 | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `budgetReserved`                                             | *string*                                                     | :heavy_minus_sign:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `budgetRemaining`                                            | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `createdAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `expiresAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `revokedAt`                                                  | *number*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
| `lastUsedAt`                                                 | *number*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
| `name`                                                       | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
| `chainId`                                                    | *number*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
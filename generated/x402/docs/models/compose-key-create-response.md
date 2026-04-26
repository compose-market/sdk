# ComposeKeyCreateResponse

## Example Usage

```typescript
import { ComposeKeyCreateResponse } from "@compose-market/sdk/models";

let value: ComposeKeyCreateResponse = {
  keyId: "<id>",
  token: "<value>",
  purpose: "api",
  budgetLimit: "1000000",
  budgetUsed: "1000000",
  budgetRemaining: "1000000",
  createdAt: 863262,
  expiresAt: 347811,
  chainId: 942641,
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  | Example                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `keyId`                                                      | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `token`                                                      | *string*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `purpose`                                                    | [models.ComposeKeyPurpose](../models/compose-key-purpose.md) | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `budgetLimit`                                                | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `budgetUsed`                                                 | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `budgetRemaining`                                            | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `createdAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `expiresAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `chainId`                                                    | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `name`                                                       | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
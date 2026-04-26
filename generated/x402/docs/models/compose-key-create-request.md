# ComposeKeyCreateRequest

## Example Usage

```typescript
import { ComposeKeyCreateRequest } from "@compose-market/sdk/models";

let value: ComposeKeyCreateRequest = {
  budgetLimit: "1000000",
  expiresAt: 457980,
  purpose: "api",
  chainId: 65618,
};
```

## Fields

| Field                                                        | Type                                                         | Required                                                     | Description                                                  | Example                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `budgetLimit`                                                | *string*                                                     | :heavy_check_mark:                                           | Non-negative integer amount in USDC atomic units.            | 1000000                                                      |
| `expiresAt`                                                  | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `purpose`                                                    | [models.ComposeKeyPurpose](../models/compose-key-purpose.md) | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `chainId`                                                    | *number*                                                     | :heavy_check_mark:                                           | N/A                                                          |                                                              |
| `name`                                                       | *string*                                                     | :heavy_minus_sign:                                           | N/A                                                          |                                                              |
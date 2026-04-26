# ComposeKeysCreateRequest

## Example Usage

```typescript
import { ComposeKeysCreateRequest } from "@compose-market/sdk/models/operations";

let value: ComposeKeysCreateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xChainId: 59328,
  body: {
    budgetLimit: "1000000",
    expiresAt: 732326,
    purpose: "session",
    chainId: 592858,
  },
};
```

## Fields

| Field                                                                        | Type                                                                         | Required                                                                     | Description                                                                  | Example                                                                      |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                        | *string*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          | 0x1111111111111111111111111111111111111111                                   |
| `xChainId`                                                                   | *number*                                                                     | :heavy_check_mark:                                                           | N/A                                                                          |                                                                              |
| `body`                                                                       | [models.ComposeKeyCreateRequest](../../models/compose-key-create-request.md) | :heavy_check_mark:                                                           | N/A                                                                          |                                                                              |
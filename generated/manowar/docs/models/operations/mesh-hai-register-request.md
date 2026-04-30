# MeshHaiRegisterRequest

## Example Usage

```typescript
import { MeshHaiRegisterRequest } from "@compose-market/sdk/models/operations";

let value: MeshHaiRegisterRequest = {
  body: {
    agentWallet: "<value>",
    userAddress: "<value>",
    deviceId: "<id>",
  },
};
```

## Fields

| Field                                                                                              | Type                                                                                               | Required                                                                                           | Description                                                                                        |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `xComposeLocalRuntimeToken`                                                                        | *string*                                                                                           | :heavy_minus_sign:                                                                                 | N/A                                                                                                |
| `body`                                                                                             | [operations.MeshHaiRegisterRequestBody](../../models/operations/mesh-hai-register-request-body.md) | :heavy_check_mark:                                                                                 | N/A                                                                                                |
# MeshActionsExecuteRequest

## Example Usage

```typescript
import { MeshActionsExecuteRequest } from "@compose-market/sdk/models/operations";

let value: MeshActionsExecuteRequest = {
  body: {
    agentWallet: "<value>",
    toolName: "save_memory",
    haiId: "<id>",
    threadId: "<id>",
  },
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `xComposeLocalRuntimeToken`                                                    | *string*                                                                       | :heavy_minus_sign:                                                             | N/A                                                                            |
| `body`                                                                         | [models.MeshActionExecuteRequest](../../models/mesh-action-execute-request.md) | :heavy_check_mark:                                                             | N/A                                                                            |
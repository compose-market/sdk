# MeshToolsExecuteRequest

## Example Usage

```typescript
import { MeshToolsExecuteRequest } from "@compose-market/sdk/models/operations";

let value: MeshToolsExecuteRequest = {
  body: {
    agentWallet: "<value>",
    toolName: "search_memory",
    haiId: "<id>",
    threadId: "<id>",
  },
};
```

## Fields

| Field                                                                      | Type                                                                       | Required                                                                   | Description                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `xComposeLocalRuntimeToken`                                                | *string*                                                                   | :heavy_minus_sign:                                                         | N/A                                                                        |
| `body`                                                                     | [models.MeshToolExecuteRequest](../../models/mesh-tool-execute-request.md) | :heavy_check_mark:                                                         | N/A                                                                        |
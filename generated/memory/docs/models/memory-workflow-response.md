# MemoryWorkflowResponse

## Example Usage

```typescript
import { MemoryWorkflowResponse } from "@compose-market/sdk/models";

let value: MemoryWorkflowResponse = {
  workflow: {
    id: "<id>",
    version: "compose.agent_memory.v1",
    description:
      "sundae anti till rule worth greedy mouser dampen hundred entry",
    loop: "hot",
    tokenPolicy: "returns compact prompt only",
    steps: [
      {
        operationId: "<id>",
        method: "PATCH",
        path: "/home/user/dir",
        purpose: "<value>",
      },
    ],
  },
};
```

## Fields

| Field                                                                  | Type                                                                   | Required                                                               | Description                                                            |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `workflow`                                                             | [models.MemoryWorkflowManifest](../models/memory-workflow-manifest.md) | :heavy_check_mark:                                                     | N/A                                                                    |
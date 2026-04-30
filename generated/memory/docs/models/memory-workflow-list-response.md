# MemoryWorkflowListResponse

## Example Usage

```typescript
import { MemoryWorkflowListResponse } from "@compose-market/sdk/models";

let value: MemoryWorkflowListResponse = {
  workflows: [
    {
      id: "<id>",
      version: "compose.agent_memory.v1",
      description: "kindheartedly excepting gently too mallard once yum",
      loop: "hot",
      tokenPolicy: "returns compact prompt only",
      steps: [],
    },
  ],
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `workflows`                                                              | [models.MemoryWorkflowManifest](../models/memory-workflow-manifest.md)[] | :heavy_check_mark:                                                       | N/A                                                                      |
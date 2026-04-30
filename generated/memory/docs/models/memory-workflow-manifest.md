# MemoryWorkflowManifest

## Example Usage

```typescript
import { MemoryWorkflowManifest } from "@compose-market/sdk/models";

let value: MemoryWorkflowManifest = {
  id: "<id>",
  version: "compose.agent_memory.v1",
  description: "but unlike hence punctually",
  loop: "hot",
  tokenPolicy: "returns metadata only",
  steps: [],
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `id`                                                                              | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `version`                                                                         | *"compose.agent_memory.v1"*                                                       | :heavy_check_mark:                                                                | N/A                                                                               |
| `description`                                                                     | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `loop`                                                                            | [models.Loop](../models/loop.md)                                                  | :heavy_check_mark:                                                                | N/A                                                                               |
| `tokenPolicy`                                                                     | [models.TokenPolicy](../models/token-policy.md)                                   | :heavy_check_mark:                                                                | N/A                                                                               |
| `steps`                                                                           | [models.MemoryWorkflowStepManifest](../models/memory-workflow-step-manifest.md)[] | :heavy_check_mark:                                                                | N/A                                                                               |
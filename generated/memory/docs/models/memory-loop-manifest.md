# MemoryLoopManifest

## Example Usage

```typescript
import { MemoryLoopManifest } from "@compose-market/sdk/models";

let value: MemoryLoopManifest = {
  id: "<id>",
  version: "compose.agent_memory_loop.v1",
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
| `version`                                                                         | *"compose.agent_memory_loop.v1"*                                                       | :heavy_check_mark:                                                                | N/A                                                                               |
| `description`                                                                     | *string*                                                                          | :heavy_check_mark:                                                                | N/A                                                                               |
| `loop`                                                                            | [models.Loop](../models/loop.md)                                                  | :heavy_check_mark:                                                                | N/A                                                                               |
| `tokenPolicy`                                                                     | [models.TokenPolicy](../models/token-policy.md)                                   | :heavy_check_mark:                                                                | N/A                                                                               |
| `steps`                                                                           | [models.MemoryLoopStepManifest](../models/memory-loop-step-manifest.md)[] | :heavy_check_mark:                                                                | N/A                                                                               |
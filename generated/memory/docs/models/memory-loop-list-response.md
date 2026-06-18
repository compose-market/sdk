# MemoryLoopListResponse

## Example Usage

```typescript
import { MemoryLoopListResponse } from "@compose-market/sdk/models";

let value: MemoryLoopListResponse = {
  loops: [
    {
      id: "<id>",
      version: "compose.agent_memory_loop.v1",
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
| `loops`                                                              | [models.MemoryLoopManifest](../models/memory-loop-manifest.md)[] | :heavy_check_mark:                                                       | N/A                                                                      |
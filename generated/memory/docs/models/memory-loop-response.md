# MemoryLoopResponse

## Example Usage

```typescript
import { MemoryLoopResponse } from "@compose-market/sdk/models";

let value: MemoryLoopResponse = {
  loop: {
    id: "<id>",
    version: "compose.agent_memory_loop.v1",
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
| `loop`                                                             | [models.MemoryLoopManifest](../models/memory-loop-manifest.md) | :heavy_check_mark:                                                     | N/A                                                                    |
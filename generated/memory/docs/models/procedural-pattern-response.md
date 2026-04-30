# ProceduralPatternResponse

## Example Usage

```typescript
import { ProceduralPatternResponse } from "@compose-market/sdk/models";

let value: ProceduralPatternResponse = {
  pattern: {
    patternId: "<id>",
    agentWallet: "<value>",
    patternType: "tool_sequence",
    trigger: {
      type: "context",
      value: "<value>",
    },
    steps: [
      {
        action: "<value>",
        order: 920242,
      },
    ],
    summary: "<value>",
    successRate: 736.7,
    executionCount: 131831,
    lastExecuted: 868698,
    createdAt: 108711,
  },
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `pattern`                                                   | [models.ProceduralPattern](../models/procedural-pattern.md) | :heavy_check_mark:                                          | N/A                                                         |
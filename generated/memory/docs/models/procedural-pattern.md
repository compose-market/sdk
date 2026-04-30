# ProceduralPattern

## Example Usage

```typescript
import { ProceduralPattern } from "@compose-market/sdk/models";

let value: ProceduralPattern = {
  patternId: "<id>",
  agentWallet: "<value>",
  patternType: "response",
  trigger: {
    type: "context",
    value: "<value>",
  },
  steps: [],
  summary: "<value>",
  successRate: 5726.78,
  executionCount: 776648,
  lastExecuted: 800927,
  createdAt: 957278,
};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `patternId`                                                          | *string*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `agentWallet`                                                        | *string*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `mode`                                                               | [models.ProceduralPatternMode](../models/procedural-pattern-mode.md) | :heavy_minus_sign:                                                   | N/A                                                                  |
| `haiId`                                                              | *string*                                                             | :heavy_minus_sign:                                                   | N/A                                                                  |
| `patternType`                                                        | [models.PatternType](../models/pattern-type.md)                      | :heavy_check_mark:                                                   | N/A                                                                  |
| `trigger`                                                            | [models.Trigger](../models/trigger.md)                               | :heavy_check_mark:                                                   | N/A                                                                  |
| `steps`                                                              | [models.Step](../models/step.md)[]                                   | :heavy_check_mark:                                                   | N/A                                                                  |
| `summary`                                                            | *string*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `successRate`                                                        | *number*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `executionCount`                                                     | *number*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `lastExecuted`                                                       | *number*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `metadata`                                                           | Record<string, *any*>                                                | :heavy_minus_sign:                                                   | N/A                                                                  |
| `createdAt`                                                          | *number*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `updatedAt`                                                          | *number*                                                             | :heavy_minus_sign:                                                   | N/A                                                                  |
# MemoryEvalRunResponse

## Example Usage

```typescript
import { MemoryEvalRunResponse } from "@compose-market/sdk/models";

let value: MemoryEvalRunResponse = {
  evalRunId: "<id>",
  status: "completed",
  scores: {
    recallAtK: 5050.88,
    precisionAtK: 8627.62,
    avgContextCharacters: 2443.52,
    cases: 889540,
  },
  results: [
    {
      query: "<value>",
      hit: true,
      returned: 137987,
      contextCharacters: 844746,
    },
  ],
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `evalRunId`                                                                        | *string*                                                                           | :heavy_check_mark:                                                                 | N/A                                                                                |
| `status`                                                                           | [models.MemoryEvalRunResponseStatus](../models/memory-eval-run-response-status.md) | :heavy_check_mark:                                                                 | N/A                                                                                |
| `scores`                                                                           | [models.Scores](../models/scores.md)                                               | :heavy_check_mark:                                                                 | N/A                                                                                |
| `avgSearchLatencyMs`                                                               | *number*                                                                           | :heavy_minus_sign:                                                                 | N/A                                                                                |
| `results`                                                                          | [models.Result](../models/result.md)[]                                             | :heavy_check_mark:                                                                 | N/A                                                                                |
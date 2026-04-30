# PatternsPromoteRequest

## Example Usage

```typescript
import { PatternsPromoteRequest } from "@compose-market/sdk/models/operations";

let value: PatternsPromoteRequest = {
  patternId: "<id>",
  body: {
    skillName: "<value>",
    validationData: {
      valid: false,
      confidence: 6221.45,
      occurrences: 582792,
      successRate: 1790.99,
      toolSequence: [
        "<value 1>",
      ],
    },
  },
};
```

## Fields

| Field                                                                                | Type                                                                                 | Required                                                                             | Description                                                                          |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| `patternId`                                                                          | *string*                                                                             | :heavy_check_mark:                                                                   | N/A                                                                                  |
| `body`                                                                               | [models.MemoryPatternPromoteRequest](../../models/memory-pattern-promote-request.md) | :heavy_check_mark:                                                                   | N/A                                                                                  |
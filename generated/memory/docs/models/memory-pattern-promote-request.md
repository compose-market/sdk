# MemoryPatternPromoteRequest

## Example Usage

```typescript
import { MemoryPatternPromoteRequest } from "@compose-market/sdk/models";

let value: MemoryPatternPromoteRequest = {
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
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `skillName`                                                              | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |
| `validationData`                                                         | [models.MemoryPatternValidation](../models/memory-pattern-validation.md) | :heavy_check_mark:                                                       | N/A                                                                      |
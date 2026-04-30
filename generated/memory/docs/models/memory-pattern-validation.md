# MemoryPatternValidation

## Example Usage

```typescript
import { MemoryPatternValidation } from "@compose-market/sdk/models";

let value: MemoryPatternValidation = {
  valid: false,
  confidence: 6750.93,
  occurrences: 681768,
  successRate: 1938.27,
  toolSequence: [
    "<value 1>",
    "<value 2>",
    "<value 3>",
  ],
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `valid`            | *boolean*          | :heavy_check_mark: | N/A                |
| `confidence`       | *number*           | :heavy_check_mark: | N/A                |
| `occurrences`      | *number*           | :heavy_check_mark: | N/A                |
| `successRate`      | *number*           | :heavy_check_mark: | N/A                |
| `toolSequence`     | *string*[]         | :heavy_check_mark: | N/A                |
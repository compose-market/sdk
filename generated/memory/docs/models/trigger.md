# Trigger

## Example Usage

```typescript
import { Trigger } from "@compose-market/sdk/models";

let value: Trigger = {
  type: "keyword",
  value: "<value>",
};
```

## Fields

| Field                                                                | Type                                                                 | Required                                                             | Description                                                          |
| -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `type`                                                               | [models.ProceduralPatternType](../models/procedural-pattern-type.md) | :heavy_check_mark:                                                   | N/A                                                                  |
| `value`                                                              | *string*                                                             | :heavy_check_mark:                                                   | N/A                                                                  |
| `conditions`                                                         | Record<string, *any*>                                                | :heavy_minus_sign:                                                   | N/A                                                                  |
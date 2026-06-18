# MemoryLoopStepManifest

## Example Usage

```typescript
import { MemoryLoopStepManifest } from "@compose-market/sdk/models";

let value: MemoryLoopStepManifest = {
  operationId: "<id>",
  method: "PATCH",
  path: "/opt/share",
  purpose: "<value>",
};
```

## Fields

| Field                                | Type                                 | Required                             | Description                          |
| ------------------------------------ | ------------------------------------ | ------------------------------------ | ------------------------------------ |
| `operationId`                        | *string*                             | :heavy_check_mark:                   | N/A                                  |
| `method`                             | [models.Method](../models/method.md) | :heavy_check_mark:                   | N/A                                  |
| `path`                               | *string*                             | :heavy_check_mark:                   | N/A                                  |
| `purpose`                            | *string*                             | :heavy_check_mark:                   | N/A                                  |
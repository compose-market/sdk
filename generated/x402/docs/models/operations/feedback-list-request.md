# FeedbackListRequest

## Example Usage

```typescript
import { FeedbackListRequest } from "@compose-market/sdk/models/operations";

let value: FeedbackListRequest = {
  targetType: "x402",
  targetId: "<id>",
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `targetType`                                                      | [models.FeedbackTargetType](../../models/feedback-target-type.md) | :heavy_check_mark:                                                | N/A                                                               |
| `targetId`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `limit`                                                           | *number*                                                          | :heavy_minus_sign:                                                | N/A                                                               |
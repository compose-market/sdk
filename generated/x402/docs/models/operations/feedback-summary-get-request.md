# FeedbackSummaryGetRequest

## Example Usage

```typescript
import { FeedbackSummaryGetRequest } from "@compose-market/sdk/models/operations";

let value: FeedbackSummaryGetRequest = {
  targetType: "endpoint",
  targetId: "<id>",
};
```

## Fields

| Field                                                             | Type                                                              | Required                                                          | Description                                                       |
| ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------- |
| `targetType`                                                      | [models.FeedbackTargetType](../../models/feedback-target-type.md) | :heavy_check_mark:                                                | N/A                                                               |
| `targetId`                                                        | *string*                                                          | :heavy_check_mark:                                                | N/A                                                               |
| `recentLimit`                                                     | *number*                                                          | :heavy_minus_sign:                                                | N/A                                                               |
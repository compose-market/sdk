# FeedbackSubmitResponse

## Example Usage

```typescript
import { FeedbackSubmitResponse } from "@compose-market/sdk/models";

let value: FeedbackSubmitResponse = {
  feedbackId: "<id>",
  target: {
    type: "workflow",
    id: "<id>",
  },
  verification: "wallet_header",
  createdAt: 617298,
};
```

## Fields

| Field                                                                      | Type                                                                       | Required                                                                   | Description                                                                |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `feedbackId`                                                               | *string*                                                                   | :heavy_check_mark:                                                         | N/A                                                                        |
| `target`                                                                   | [models.FeedbackTarget](../models/feedback-target.md)                      | :heavy_check_mark:                                                         | N/A                                                                        |
| `verification`                                                             | [models.FeedbackVerificationKind](../models/feedback-verification-kind.md) | :heavy_check_mark:                                                         | N/A                                                                        |
| `createdAt`                                                                | *number*                                                                   | :heavy_check_mark:                                                         | N/A                                                                        |
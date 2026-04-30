# FeedbackSummaryGetResponse

## Example Usage

```typescript
import { FeedbackSummaryGetResponse } from "@compose-market/sdk/models/operations";

let value: FeedbackSummaryGetResponse = {
  contentType: "<value>",
  statusCode: 594765,
};
```

## Fields

| Field                                                                             | Type                                                                              | Required                                                                          | Description                                                                       |
| --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `contentType`                                                                     | *string*                                                                          | :heavy_check_mark:                                                                | HTTP response content type for this operation                                     |
| `statusCode`                                                                      | *number*                                                                          | :heavy_check_mark:                                                                | HTTP response status code for this operation                                      |
| `rawResponse`                                                                     | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)             | :heavy_check_mark:                                                                | Raw HTTP response; suitable for custom response parsing                           |
| `feedbackSummary`                                                                 | [models.FeedbackSummary](../../models/feedback-summary.md)                        | :heavy_minus_sign:                                                                | Reputation summary for one endpoint, x402 flow, model, agent, or workflow target. |
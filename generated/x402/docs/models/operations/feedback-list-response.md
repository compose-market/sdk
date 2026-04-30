# FeedbackListResponse

## Example Usage

```typescript
import { FeedbackListResponse } from "@compose-market/sdk/models/operations";

let value: FeedbackListResponse = {
  contentType: "<value>",
  statusCode: 503843,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `feedbackListResponse`                                                | [models.FeedbackListResponse](../../models/feedback-list-response.md) | :heavy_minus_sign:                                                    | Recent feedback for one target.                                       |
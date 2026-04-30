# SchedulesResumeResponse

## Example Usage

```typescript
import { SchedulesResumeResponse } from "@compose-market/sdk/models/operations";

let value: SchedulesResumeResponse = {
  contentType: "<value>",
  statusCode: 839386,
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `contentType`                                                                          | *string*                                                                               | :heavy_check_mark:                                                                     | HTTP response content type for this operation                                          |
| `statusCode`                                                                           | *number*                                                                               | :heavy_check_mark:                                                                     | HTTP response status code for this operation                                           |
| `rawResponse`                                                                          | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                  | :heavy_check_mark:                                                                     | Raw HTTP response; suitable for custom response parsing                                |
| `memoryScheduleResumeResponse`                                                         | [models.MemoryScheduleResumeResponse](../../models/memory-schedule-resume-response.md) | :heavy_minus_sign:                                                                     | Schedule resume result.                                                                |
# SchedulesListResponse

## Example Usage

```typescript
import { SchedulesListResponse } from "@compose-market/sdk/models/operations";

let value: SchedulesListResponse = {
  contentType: "<value>",
  statusCode: 227720,
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `contentType`                                                                      | *string*                                                                           | :heavy_check_mark:                                                                 | HTTP response content type for this operation                                      |
| `statusCode`                                                                       | *number*                                                                           | :heavy_check_mark:                                                                 | HTTP response status code for this operation                                       |
| `rawResponse`                                                                      | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)              | :heavy_check_mark:                                                                 | Raw HTTP response; suitable for custom response parsing                            |
| `memoryScheduleListResponse`                                                       | [models.MemoryScheduleListResponse](../../models/memory-schedule-list-response.md) | :heavy_minus_sign:                                                                 | Memory schedules.                                                                  |
# SchedulesDeleteResponse

## Example Usage

```typescript
import { SchedulesDeleteResponse } from "@compose-market/sdk/models/operations";

let value: SchedulesDeleteResponse = {
  contentType: "<value>",
  statusCode: 279611,
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `contentType`                                                                          | *string*                                                                               | :heavy_check_mark:                                                                     | HTTP response content type for this operation                                          |
| `statusCode`                                                                           | *number*                                                                               | :heavy_check_mark:                                                                     | HTTP response status code for this operation                                           |
| `rawResponse`                                                                          | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                  | :heavy_check_mark:                                                                     | Raw HTTP response; suitable for custom response parsing                                |
| `memoryScheduleDeleteResponse`                                                         | [models.MemoryScheduleDeleteResponse](../../models/memory-schedule-delete-response.md) | :heavy_minus_sign:                                                                     | Schedule delete result.                                                                |
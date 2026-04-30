# JobsGetResponse

## Example Usage

```typescript
import { JobsGetResponse } from "@compose-market/sdk/models/operations";

let value: JobsGetResponse = {
  contentType: "<value>",
  statusCode: 314333,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `memoryJobRecord`                                                     | [models.MemoryJobRecord](../../models/memory-job-record.md)           | :heavy_minus_sign:                                                    | Memory maintenance job.                                               |
# JobsCreateResponse

## Example Usage

```typescript
import { JobsCreateResponse } from "@compose-market/sdk/models/operations";

let value: JobsCreateResponse = {
  contentType: "<value>",
  statusCode: 390332,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `memoryJobRecord`                                                     | [models.MemoryJobRecord](../../models/memory-job-record.md)           | :heavy_minus_sign:                                                    | Completed maintenance job.                                            |
# StatsGetResponse

## Example Usage

```typescript
import { StatsGetResponse } from "@compose-market/sdk/models/operations";

let value: StatsGetResponse = {
  contentType: "<value>",
  statusCode: 762942,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `memoryStatsResponse`                                                 | [models.MemoryStatsResponse](../../models/memory-stats-response.md)   | :heavy_minus_sign:                                                    | Memory statistics.                                                    |
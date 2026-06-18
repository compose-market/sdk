# LoopsListResponse

## Example Usage

```typescript
import { LoopsListResponse } from "@compose-market/sdk/models/operations";

let value: LoopsListResponse = {
  contentType: "<value>",
  statusCode: 732021,
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `contentType`                                                                      | *string*                                                                           | :heavy_check_mark:                                                                 | HTTP response content type for this operation                                      |
| `statusCode`                                                                       | *number*                                                                           | :heavy_check_mark:                                                                 | HTTP response status code for this operation                                       |
| `rawResponse`                                                                      | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)              | :heavy_check_mark:                                                                 | Raw HTTP response; suitable for custom response parsing                            |
| `memoryLoopListResponse`                                                       | [models.MemoryLoopListResponse](../../models/memory-loop-list-response.md) | :heavy_minus_sign:                                                                 | Memory loop manifests.                                                         |
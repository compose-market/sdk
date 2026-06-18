# LoopsGetResponse

## Example Usage

```typescript
import { LoopsGetResponse } from "@compose-market/sdk/models/operations";

let value: LoopsGetResponse = {
  contentType: "<value>",
  statusCode: 40890,
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `contentType`                                                             | *string*                                                                  | :heavy_check_mark:                                                        | HTTP response content type for this operation                             |
| `statusCode`                                                              | *number*                                                                  | :heavy_check_mark:                                                        | HTTP response status code for this operation                              |
| `rawResponse`                                                             | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)     | :heavy_check_mark:                                                        | Raw HTTP response; suitable for custom response parsing                   |
| `memoryLoopResponse`                                                  | [models.MemoryLoopResponse](../../models/memory-loop-response.md) | :heavy_minus_sign:                                                        | Memory loop manifest.                                                 |
# EvalsRunResponse

## Example Usage

```typescript
import { EvalsRunResponse } from "@compose-market/sdk/models/operations";

let value: EvalsRunResponse = {
  contentType: "<value>",
  statusCode: 359290,
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `contentType`                                                            | *string*                                                                 | :heavy_check_mark:                                                       | HTTP response content type for this operation                            |
| `statusCode`                                                             | *number*                                                                 | :heavy_check_mark:                                                       | HTTP response status code for this operation                             |
| `rawResponse`                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)    | :heavy_check_mark:                                                       | Raw HTTP response; suitable for custom response parsing                  |
| `memoryEvalRunResponse`                                                  | [models.MemoryEvalRunResponse](../../models/memory-eval-run-response.md) | :heavy_minus_sign:                                                       | Memory eval result.                                                      |
# PatternsValidateResponse

## Example Usage

```typescript
import { PatternsValidateResponse } from "@compose-market/sdk/models/operations";

let value: PatternsValidateResponse = {
  contentType: "<value>",
  statusCode: 600875,
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `contentType`                                                               | *string*                                                                    | :heavy_check_mark:                                                          | HTTP response content type for this operation                               |
| `statusCode`                                                                | *number*                                                                    | :heavy_check_mark:                                                          | HTTP response status code for this operation                                |
| `rawResponse`                                                               | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)       | :heavy_check_mark:                                                          | Raw HTTP response; suitable for custom response parsing                     |
| `memoryPatternValidation`                                                   | [models.MemoryPatternValidation](../../models/memory-pattern-validation.md) | :heavy_minus_sign:                                                          | Pattern validation result.                                                  |
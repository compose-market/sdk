# PatternsGetResponse

## Example Usage

```typescript
import { PatternsGetResponse } from "@compose-market/sdk/models/operations";

let value: PatternsGetResponse = {
  contentType: "<value>",
  statusCode: 858640,
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `contentType`                                                                   | *string*                                                                        | :heavy_check_mark:                                                              | HTTP response content type for this operation                                   |
| `statusCode`                                                                    | *number*                                                                        | :heavy_check_mark:                                                              | HTTP response status code for this operation                                    |
| `rawResponse`                                                                   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)           | :heavy_check_mark:                                                              | Raw HTTP response; suitable for custom response parsing                         |
| `proceduralPatternResponse`                                                     | [models.ProceduralPatternResponse](../../models/procedural-pattern-response.md) | :heavy_minus_sign:                                                              | Procedural memory pattern.                                                      |
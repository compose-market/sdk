# SessionsCompressResponse

## Example Usage

```typescript
import { SessionsCompressResponse } from "@compose-market/sdk/models/operations";

let value: SessionsCompressResponse = {
  contentType: "<value>",
  statusCode: 465793,
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `contentType`                                                               | *string*                                                                    | :heavy_check_mark:                                                          | HTTP response content type for this operation                               |
| `statusCode`                                                                | *number*                                                                    | :heavy_check_mark:                                                          | HTTP response status code for this operation                                |
| `rawResponse`                                                               | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)       | :heavy_check_mark:                                                          | Raw HTTP response; suitable for custom response parsing                     |
| `sessionCompressResponse`                                                   | [models.SessionCompressResponse](../../models/session-compress-response.md) | :heavy_minus_sign:                                                          | Session compression result.                                                 |
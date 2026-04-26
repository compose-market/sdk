# X402SupportedResponse

## Example Usage

```typescript
import { X402SupportedResponse } from "@compose-market/sdk/models/operations";

let value: X402SupportedResponse = {
  contentType: "<value>",
  statusCode: 13801,
};
```

## Fields

| Field                                                                                 | Type                                                                                  | Required                                                                              | Description                                                                           |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| `contentType`                                                                         | *string*                                                                              | :heavy_check_mark:                                                                    | HTTP response content type for this operation                                         |
| `statusCode`                                                                          | *number*                                                                              | :heavy_check_mark:                                                                    | HTTP response status code for this operation                                          |
| `rawResponse`                                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                 | :heavy_check_mark:                                                                    | Raw HTTP response; suitable for custom response parsing                               |
| `facilitatorSupportedResponse`                                                        | [models.FacilitatorSupportedResponse](../../models/facilitator-supported-response.md) | :heavy_minus_sign:                                                                    | Supported x402 schemes and networks.                                                  |
# X402ChainsListResponse

## Example Usage

```typescript
import { X402ChainsListResponse } from "@compose-market/sdk/models/operations";

let value: X402ChainsListResponse = {
  contentType: "<value>",
  statusCode: 622730,
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `contentType`                                                                   | *string*                                                                        | :heavy_check_mark:                                                              | HTTP response content type for this operation                                   |
| `statusCode`                                                                    | *number*                                                                        | :heavy_check_mark:                                                              | HTTP response status code for this operation                                    |
| `rawResponse`                                                                   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)           | :heavy_check_mark:                                                              | Raw HTTP response; suitable for custom response parsing                         |
| `facilitatorChainsResponse`                                                     | [models.FacilitatorChainsResponse](../../models/facilitator-chains-response.md) | :heavy_minus_sign:                                                              | EVM chains currently configured for x402 settlement.                            |
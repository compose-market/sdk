# PaymentsPrepareResponse

## Example Usage

```typescript
import { PaymentsPrepareResponse } from "@compose-market/sdk/models/operations";

let value: PaymentsPrepareResponse = {
  contentType: "<value>",
  statusCode: 728357,
  headers: {},
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `paymentPrepareResponse`                                              | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | Prepared payment intent or raw x402 settlement context.               |
| `headers`                                                             | Record<string, *string*[]>                                            | :heavy_check_mark:                                                    | N/A                                                                   |
# PaymentRequiredError

## Example Usage

```typescript
import { PaymentRequiredError } from "@compose-market/sdk/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `x402Version`                                                         | *2*                                                                   | :heavy_check_mark:                                                    | N/A                                                                   |
| `error`                                                               | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   |
| `resource`                                                            | [models.Resource](../../models/resource.md)                           | :heavy_check_mark:                                                    | N/A                                                                   |
| `accepts`                                                             | [models.PaymentRequirements](../../models/payment-requirements.md)[]  | :heavy_check_mark:                                                    | N/A                                                                   |
| `extensions`                                                          | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | N/A                                                                   |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_minus_sign:                                                    | Raw HTTP response; suitable for custom response parsing               |
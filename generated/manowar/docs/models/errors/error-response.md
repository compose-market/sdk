# ErrorResponse

Runtime error response.

## Example Usage

```typescript
import { ErrorResponse } from "@compose-market/sdk/models/errors";

// No examples available for this model
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `error`                                                               | *models.ErrorT*                                                       | :heavy_minus_sign:                                                    | N/A                                                                   |
| `code`                                                                | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   |
| `message`                                                             | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   |
| `timestamp`                                                           | *string*                                                              | :heavy_minus_sign:                                                    | N/A                                                                   |
| `additionalProperties`                                                | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | N/A                                                                   |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_minus_sign:                                                    | Raw HTTP response; suitable for custom response parsing               |
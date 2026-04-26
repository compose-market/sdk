# ComposeKeysCreateResponse

## Example Usage

```typescript
import { ComposeKeysCreateResponse } from "@compose-market/sdk/models/operations";

let value: ComposeKeysCreateResponse = {
  contentType: "<value>",
  statusCode: 190958,
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `contentType`                                                                  | *string*                                                                       | :heavy_check_mark:                                                             | HTTP response content type for this operation                                  |
| `statusCode`                                                                   | *number*                                                                       | :heavy_check_mark:                                                             | HTTP response status code for this operation                                   |
| `rawResponse`                                                                  | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)          | :heavy_check_mark:                                                             | Raw HTTP response; suitable for custom response parsing                        |
| `composeKeyCreateResponse`                                                     | [models.ComposeKeyCreateResponse](../../models/compose-key-create-response.md) | :heavy_minus_sign:                                                             | Compose Key token, returned exactly once.                                      |
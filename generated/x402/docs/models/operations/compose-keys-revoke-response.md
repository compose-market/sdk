# ComposeKeysRevokeResponse

## Example Usage

```typescript
import { ComposeKeysRevokeResponse } from "@compose-market/sdk/models/operations";

let value: ComposeKeysRevokeResponse = {
  contentType: "<value>",
  statusCode: 494287,
};
```

## Fields

| Field                                                                                                    | Type                                                                                                     | Required                                                                                                 | Description                                                                                              |
| -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `contentType`                                                                                            | *string*                                                                                                 | :heavy_check_mark:                                                                                       | HTTP response content type for this operation                                                            |
| `statusCode`                                                                                             | *number*                                                                                                 | :heavy_check_mark:                                                                                       | HTTP response status code for this operation                                                             |
| `rawResponse`                                                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                                    | :heavy_check_mark:                                                                                       | Raw HTTP response; suitable for custom response parsing                                                  |
| `object`                                                                                                 | [operations.ComposeKeysRevokeResponseBody](../../models/operations/compose-keys-revoke-response-body.md) | :heavy_minus_sign:                                                                                       | Revocation result.                                                                                       |
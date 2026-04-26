# ComposeKeysListResponse

## Example Usage

```typescript
import { ComposeKeysListResponse } from "@compose-market/sdk/models/operations";

let value: ComposeKeysListResponse = {
  contentType: "<value>",
  statusCode: 601172,
};
```

## Fields

| Field                                                                                                | Type                                                                                                 | Required                                                                                             | Description                                                                                          |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `contentType`                                                                                        | *string*                                                                                             | :heavy_check_mark:                                                                                   | HTTP response content type for this operation                                                        |
| `statusCode`                                                                                         | *number*                                                                                             | :heavy_check_mark:                                                                                   | HTTP response status code for this operation                                                         |
| `rawResponse`                                                                                        | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                                | :heavy_check_mark:                                                                                   | Raw HTTP response; suitable for custom response parsing                                              |
| `object`                                                                                             | [operations.ComposeKeysListResponseBody](../../models/operations/compose-keys-list-response-body.md) | :heavy_minus_sign:                                                                                   | Keys owned by the wallet.                                                                            |
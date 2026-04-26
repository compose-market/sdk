# ModalityListResponse

## Example Usage

```typescript
import { ModalityListResponse } from "@compose-market/sdk/models/operations";

let value: ModalityListResponse = {
  contentType: "<value>",
  statusCode: 929718,
};
```

## Fields

| Field                                                                                           | Type                                                                                            | Required                                                                                        | Description                                                                                     |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `contentType`                                                                                   | *string*                                                                                        | :heavy_check_mark:                                                                              | HTTP response content type for this operation                                                   |
| `statusCode`                                                                                    | *number*                                                                                        | :heavy_check_mark:                                                                              | HTTP response status code for this operation                                                    |
| `rawResponse`                                                                                   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                           | :heavy_check_mark:                                                                              | Raw HTTP response; suitable for custom response parsing                                         |
| `modalityListResponse`                                                                          | [models.ModalityListResponse](../../models/modality-list-response.md)                           | :heavy_minus_sign:                                                                              | Catalog of canonical modality groups, operations, model counts, and native pricing unit shapes. |
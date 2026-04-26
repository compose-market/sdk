# ModalityOperationsListResponse

## Example Usage

```typescript
import { ModalityOperationsListResponse } from "@compose-market/sdk/models/operations";

let value: ModalityOperationsListResponse = {
  contentType: "<value>",
  statusCode: 964323,
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contentType`                                                           | *string*                                                                | :heavy_check_mark:                                                      | HTTP response content type for this operation                           |
| `statusCode`                                                            | *number*                                                                | :heavy_check_mark:                                                      | HTTP response status code for this operation                            |
| `rawResponse`                                                           | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)   | :heavy_check_mark:                                                      | Raw HTTP response; suitable for custom response parsing                 |
| `operationListResponse`                                                 | [models.OperationListResponse](../../models/operation-list-response.md) | :heavy_minus_sign:                                                      | Operations available for one canonical modality.                        |
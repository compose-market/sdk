# ModalityOperationModelsListResponse

## Example Usage

```typescript
import { ModalityOperationModelsListResponse } from "@compose-market/sdk/models/operations";

let value: ModalityOperationModelsListResponse = {
  contentType: "<value>",
  statusCode: 50476,
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `contentType`                                                                   | *string*                                                                        | :heavy_check_mark:                                                              | HTTP response content type for this operation                                   |
| `statusCode`                                                                    | *number*                                                                        | :heavy_check_mark:                                                              | HTTP response status code for this operation                                    |
| `rawResponse`                                                                   | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)           | :heavy_check_mark:                                                              | Raw HTTP response; suitable for custom response parsing                         |
| `operationModelsResponse`                                                       | [models.OperationModelsResponse](../../models/operation-models-response.md)     | :heavy_minus_sign:                                                              | Cursor-paginated models that expose the requested canonical modality operation. |
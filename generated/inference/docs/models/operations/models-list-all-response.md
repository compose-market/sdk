# ModelsListAllResponse

## Example Usage

```typescript
import { ModelsListAllResponse } from "@compose-market/sdk/models/operations";

let value: ModelsListAllResponse = {
  contentType: "<value>",
  statusCode: 207278,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `modelListResponse`                                                   | [models.ModelListResponse](../../models/model-list-response.md)       | :heavy_minus_sign:                                                    | Full extended model catalog.                                          |
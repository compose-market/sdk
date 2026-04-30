# ItemsGetResponse

## Example Usage

```typescript
import { ItemsGetResponse } from "@compose-market/sdk/models/operations";

let value: ItemsGetResponse = {
  contentType: "<value>",
  statusCode: 925272,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `memoryItemResponse`                                                  | [models.MemoryItemResponse](../../models/memory-item-response.md)     | :heavy_minus_sign:                                                    | Memory item.                                                          |
# ItemsDeleteResponse

## Example Usage

```typescript
import { ItemsDeleteResponse } from "@compose-market/sdk/models/operations";

let value: ItemsDeleteResponse = {
  contentType: "<value>",
  statusCode: 32088,
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `contentType`                                                                  | *string*                                                                       | :heavy_check_mark:                                                             | HTTP response content type for this operation                                  |
| `statusCode`                                                                   | *number*                                                                       | :heavy_check_mark:                                                             | HTTP response status code for this operation                                   |
| `rawResponse`                                                                  | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)          | :heavy_check_mark:                                                             | Raw HTTP response; suitable for custom response parsing                        |
| `memoryItemDeleteResponse`                                                     | [models.MemoryItemDeleteResponse](../../models/memory-item-delete-response.md) | :heavy_minus_sign:                                                             | Delete result.                                                                 |
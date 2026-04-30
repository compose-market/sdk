# ItemsUpdateResponse

## Example Usage

```typescript
import { ItemsUpdateResponse } from "@compose-market/sdk/models/operations";

let value: ItemsUpdateResponse = {
  contentType: "<value>",
  statusCode: 84443,
};
```

## Fields

| Field                                                                          | Type                                                                           | Required                                                                       | Description                                                                    |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| `contentType`                                                                  | *string*                                                                       | :heavy_check_mark:                                                             | HTTP response content type for this operation                                  |
| `statusCode`                                                                   | *number*                                                                       | :heavy_check_mark:                                                             | HTTP response status code for this operation                                   |
| `rawResponse`                                                                  | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)          | :heavy_check_mark:                                                             | Raw HTTP response; suitable for custom response parsing                        |
| `memoryItemUpdateResponse`                                                     | [models.MemoryItemUpdateResponse](../../models/memory-item-update-response.md) | :heavy_minus_sign:                                                             | Updated memory item.                                                           |
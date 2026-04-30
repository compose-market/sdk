# LoopResponse

## Example Usage

```typescript
import { LoopResponse } from "@compose-market/sdk/models/operations";

let value: LoopResponse = {
  contentType: "<value>",
  statusCode: 790873,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `oneOf`                                                               | *operations.LoopResponseBody*                                         | :heavy_minus_sign:                                                    | Agent memory loop response.                                           |
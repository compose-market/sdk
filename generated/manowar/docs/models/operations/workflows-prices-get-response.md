# WorkflowsPricesGetResponse

## Example Usage

```typescript
import { WorkflowsPricesGetResponse } from "@compose-market/sdk/models/operations";

let value: WorkflowsPricesGetResponse = {
  contentType: "<value>",
  statusCode: 964878,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `object`                                                              | Record<string, *number*>                                              | :heavy_minus_sign:                                                    | Runtime workflow price constants.                                     |
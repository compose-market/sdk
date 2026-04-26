# AgentsResponsesCreateResponse

## Example Usage

```typescript
import { AgentsResponsesCreateResponse } from "@compose-market/sdk/models/operations";

let value: AgentsResponsesCreateResponse = {
  contentType: "<value>",
  statusCode: 254547,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `object`                                                              | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | Dynamic Responses API result executed through the agent model.        |
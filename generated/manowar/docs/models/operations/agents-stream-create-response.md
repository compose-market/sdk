# AgentsStreamCreateResponse

## Example Usage

```typescript
import { AgentsStreamCreateResponse } from "@compose-market/sdk/models/operations";

let value: AgentsStreamCreateResponse = {
  contentType: "<value>",
  statusCode: 551594,
  headers: {},
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contentType`                                                           | *string*                                                                | :heavy_check_mark:                                                      | HTTP response content type for this operation                           |
| `statusCode`                                                            | *number*                                                                | :heavy_check_mark:                                                      | HTTP response status code for this operation                            |
| `rawResponse`                                                           | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)   | :heavy_check_mark:                                                      | Raw HTTP response; suitable for custom response parsing                 |
| `agentEventStream`                                                      | *string*                                                                | :heavy_minus_sign:                                                      | Agent SSE stream carrying thinking, text, tool, error, and done frames. |
| `headers`                                                               | Record<string, *string*[]>                                              | :heavy_check_mark:                                                      | N/A                                                                     |
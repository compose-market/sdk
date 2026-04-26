# SessionEventsSubscribeResponse

## Example Usage

```typescript
import { SessionEventsSubscribeResponse } from "@compose-market/sdk/models/operations";

let value: SessionEventsSubscribeResponse = {
  contentType: "<value>",
  statusCode: 238972,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `sessionEventStream`                                                  | *string*                                                              | :heavy_minus_sign:                                                    | Server-sent session-active and session-expired frames.                |
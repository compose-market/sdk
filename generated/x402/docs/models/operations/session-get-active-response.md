# SessionGetActiveResponse

## Example Usage

```typescript
import { SessionGetActiveResponse } from "@compose-market/sdk/models/operations";

let value: SessionGetActiveResponse = {
  contentType: "<value>",
  statusCode: 852993,
};
```

## Fields

| Field                                                                   | Type                                                                    | Required                                                                | Description                                                             |
| ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `contentType`                                                           | *string*                                                                | :heavy_check_mark:                                                      | HTTP response content type for this operation                           |
| `statusCode`                                                            | *number*                                                                | :heavy_check_mark:                                                      | HTTP response status code for this operation                            |
| `rawResponse`                                                           | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)   | :heavy_check_mark:                                                      | Raw HTTP response; suitable for custom response parsing                 |
| `activeSessionMetadata`                                                 | [models.ActiveSessionMetadata](../../models/active-session-metadata.md) | :heavy_minus_sign:                                                      | Active Compose Key session metadata. The token is never returned here.  |
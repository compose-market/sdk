# SessionsWorkingUpdateResponse

## Example Usage

```typescript
import { SessionsWorkingUpdateResponse } from "@compose-market/sdk/models/operations";

let value: SessionsWorkingUpdateResponse = {
  contentType: "<value>",
  statusCode: 280267,
};
```

## Fields

| Field                                                                                  | Type                                                                                   | Required                                                                               | Description                                                                            |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `contentType`                                                                          | *string*                                                                               | :heavy_check_mark:                                                                     | HTTP response content type for this operation                                          |
| `statusCode`                                                                           | *number*                                                                               | :heavy_check_mark:                                                                     | HTTP response status code for this operation                                           |
| `rawResponse`                                                                          | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                  | :heavy_check_mark:                                                                     | Raw HTTP response; suitable for custom response parsing                                |
| `workingSessionUpdateResponse`                                                         | [models.WorkingSessionUpdateResponse](../../models/working-session-update-response.md) | :heavy_minus_sign:                                                                     | Updated working session memory.                                                        |
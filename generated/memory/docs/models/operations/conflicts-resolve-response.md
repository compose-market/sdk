# ConflictsResolveResponse

## Example Usage

```typescript
import { ConflictsResolveResponse } from "@compose-market/sdk/models/operations";

let value: ConflictsResolveResponse = {
  contentType: "<value>",
  statusCode: 120624,
};
```

## Fields

| Field                                                                                    | Type                                                                                     | Required                                                                                 | Description                                                                              |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `contentType`                                                                            | *string*                                                                                 | :heavy_check_mark:                                                                       | HTTP response content type for this operation                                            |
| `statusCode`                                                                             | *number*                                                                                 | :heavy_check_mark:                                                                       | HTTP response status code for this operation                                             |
| `rawResponse`                                                                            | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)                    | :heavy_check_mark:                                                                       | Raw HTTP response; suitable for custom response parsing                                  |
| `memoryConflictResolveResponse`                                                          | [models.MemoryConflictResolveResponse](../../models/memory-conflict-resolve-response.md) | :heavy_minus_sign:                                                                       | Conflict resolution result.                                                              |
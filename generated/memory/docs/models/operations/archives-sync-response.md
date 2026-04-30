# ArchivesSyncResponse

## Example Usage

```typescript
import { ArchivesSyncResponse } from "@compose-market/sdk/models/operations";

let value: ArchivesSyncResponse = {
  contentType: "<value>",
  statusCode: 370808,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `archiveSyncResponse`                                                 | [models.ArchiveSyncResponse](../../models/archive-sync-response.md)   | :heavy_minus_sign:                                                    | Archive sync result.                                                  |
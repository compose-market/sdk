# WorkspaceIndexResponse

## Example Usage

```typescript
import { WorkspaceIndexResponse } from "@compose-market/sdk/models/operations";

let value: WorkspaceIndexResponse = {
  contentType: "<value>",
  statusCode: 860009,
};
```

## Fields

| Field                                                                 | Type                                                                  | Required                                                              | Description                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `contentType`                                                         | *string*                                                              | :heavy_check_mark:                                                    | HTTP response content type for this operation                         |
| `statusCode`                                                          | *number*                                                              | :heavy_check_mark:                                                    | HTTP response status code for this operation                          |
| `rawResponse`                                                         | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) | :heavy_check_mark:                                                    | Raw HTTP response; suitable for custom response parsing               |
| `object`                                                              | Record<string, *any*>                                                 | :heavy_minus_sign:                                                    | Workspace index result.                                               |
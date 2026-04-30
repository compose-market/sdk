# ContextAssembleResponse

## Example Usage

```typescript
import { ContextAssembleResponse } from "@compose-market/sdk/models/operations";

let value: ContextAssembleResponse = {
  contentType: "<value>",
  statusCode: 563153,
};
```

## Fields

| Field                                                                              | Type                                                                               | Required                                                                           | Description                                                                        |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `contentType`                                                                      | *string*                                                                           | :heavy_check_mark:                                                                 | HTTP response content type for this operation                                      |
| `statusCode`                                                                       | *number*                                                                           | :heavy_check_mark:                                                                 | HTTP response status code for this operation                                       |
| `rawResponse`                                                                      | [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)              | :heavy_check_mark:                                                                 | Raw HTTP response; suitable for custom response parsing                            |
| `agentMemoryContextResponse`                                                       | [models.AgentMemoryContextResponse](../../models/agent-memory-context-response.md) | :heavy_minus_sign:                                                                 | Compact agent memory context.                                                      |
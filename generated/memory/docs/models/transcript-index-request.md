# TranscriptIndexRequest

## Example Usage

```typescript
import { TranscriptIndexRequest } from "@compose-market/sdk/models";

let value: TranscriptIndexRequest = {
  sessionId: "<id>",
  threadId: "<id>",
  agentWallet: "<value>",
  messages: [],
};
```

## Fields

| Field                                                                           | Type                                                                            | Required                                                                        | Description                                                                     |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `sessionId`                                                                     | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `threadId`                                                                      | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `agentWallet`                                                                   | *string*                                                                        | :heavy_check_mark:                                                              | N/A                                                                             |
| `userAddress`                                                                   | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `mode`                                                                          | [models.TranscriptIndexRequestMode](../models/transcript-index-request-mode.md) | :heavy_minus_sign:                                                              | N/A                                                                             |
| `haiId`                                                                         | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `messages`                                                                      | [models.AgentMemoryTurnMessage](../models/agent-memory-turn-message.md)[]       | :heavy_check_mark:                                                              | N/A                                                                             |
| `modelUsed`                                                                     | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `model`                                                                         | *string*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `totalTokens`                                                                   | *number*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `tokenCount`                                                                    | *number*                                                                        | :heavy_minus_sign:                                                              | N/A                                                                             |
| `rememberWorkingMemory`                                                         | *boolean*                                                                       | :heavy_minus_sign:                                                              | N/A                                                                             |
# SessionTranscript

## Example Usage

```typescript
import { SessionTranscript } from "@compose-market/sdk/models";

let value: SessionTranscript = {
  sessionId: "<id>",
  threadId: "<id>",
  agentWallet: "<value>",
  messages: [
    {
      role: "tool",
      content: "<value>",
    },
  ],
  metadata: {},
  createdAt: 324849,
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `sessionId`                                                               | *string*                                                                  | :heavy_check_mark:                                                        | N/A                                                                       |
| `threadId`                                                                | *string*                                                                  | :heavy_check_mark:                                                        | N/A                                                                       |
| `agentWallet`                                                             | *string*                                                                  | :heavy_check_mark:                                                        | N/A                                                                       |
| `userAddress`                                                             | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |
| `mode`                                                                    | [models.SessionTranscriptMode](../models/session-transcript-mode.md)      | :heavy_minus_sign:                                                        | N/A                                                                       |
| `haiId`                                                                   | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |
| `messages`                                                                | [models.AgentMemoryTurnMessage](../models/agent-memory-turn-message.md)[] | :heavy_check_mark:                                                        | N/A                                                                       |
| `summary`                                                                 | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |
| `tokenCount`                                                              | *number*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |
| `metadata`                                                                | Record<string, *any*>                                                     | :heavy_check_mark:                                                        | N/A                                                                       |
| `createdAt`                                                               | *number*                                                                  | :heavy_check_mark:                                                        | N/A                                                                       |
| `expiresAt`                                                               | *number*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |
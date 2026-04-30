# AgentMemoryContextUsage

## Example Usage

```typescript
import { AgentMemoryContextUsage } from "@compose-market/sdk/models";

let value: AgentMemoryContextUsage = {
  characters: 122160,
  rawCharacters: 464825,
  savedCharactersVsRaw: 924787,
  items: 789655,
};
```

## Fields

| Field                  | Type                   | Required               | Description            |
| ---------------------- | ---------------------- | ---------------------- | ---------------------- |
| `characters`           | *number*               | :heavy_check_mark:     | N/A                    |
| `rawCharacters`        | *number*               | :heavy_check_mark:     | N/A                    |
| `budgetCharacters`     | *number*               | :heavy_minus_sign:     | N/A                    |
| `savedCharactersVsRaw` | *number*               | :heavy_check_mark:     | N/A                    |
| `items`                | *number*               | :heavy_check_mark:     | N/A                    |
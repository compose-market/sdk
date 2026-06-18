# PatternType

## Example Usage

```typescript
import { PatternType } from "@compose-market/sdk/models";

let value: PatternType = "routine";

// Open enum: unrecognized values are captured as Unrecognized<string>
```

## Values

```typescript
"routine" | "decision" | "response" | "tool_sequence" | Unrecognized<string>
```
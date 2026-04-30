# PatternType

## Example Usage

```typescript
import { PatternType } from "@compose-market/sdk/models";

let value: PatternType = "workflow";

// Open enum: unrecognized values are captured as Unrecognized<string>
```

## Values

```typescript
"workflow" | "decision" | "response" | "tool_sequence" | Unrecognized<string>
```
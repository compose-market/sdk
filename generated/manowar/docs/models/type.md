# Type

Advisory attachment kind. Agents and workflows pass attachments through without model-capability gating.

## Example Usage

```typescript
import { Type } from "@compose-market/sdk/models";

let value: Type = "image";
```

## Values

```typescript
"image" | "audio" | "video" | "pdf" | "file" | "text" | "json" | "url"
```
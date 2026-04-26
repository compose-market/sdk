# FacilitatorSupportedResponse

## Example Usage

```typescript
import { FacilitatorSupportedResponse } from "@compose-market/sdk/models";

let value: FacilitatorSupportedResponse = {
  kinds: [],
  extensions: [],
};
```

## Fields

| Field                              | Type                               | Required                           | Description                        |
| ---------------------------------- | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| `kinds`                            | [models.Kind](../models/kind.md)[] | :heavy_check_mark:                 | N/A                                |
| `extensions`                       | *string*[]                         | :heavy_check_mark:                 | N/A                                |
| `signers`                          | Record<string, *string*[]>         | :heavy_minus_sign:                 | N/A                                |
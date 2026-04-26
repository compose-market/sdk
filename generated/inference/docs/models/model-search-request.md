# ModelSearchRequest

## Example Usage

```typescript
import { ModelSearchRequest } from "@compose-market/sdk/models";

let value: ModelSearchRequest = {};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `q`                                                         | *string*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
| `modality`                                                  | [models.CanonicalModality](../models/canonical-modality.md) | :heavy_minus_sign:                                          | N/A                                                         |
| `operation`                                                 | *string*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
| `provider`                                                  | [models.ModelProvider](../models/model-provider.md)         | :heavy_minus_sign:                                          | N/A                                                         |
| `priceMaxPerMTok`                                           | *number*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
| `contextWindowMin`                                          | *number*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
| `streaming`                                                 | *boolean*                                                   | :heavy_minus_sign:                                          | N/A                                                         |
| `cursor`                                                    | *string*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
| `limit`                                                     | *number*                                                    | :heavy_minus_sign:                                          | N/A                                                         |
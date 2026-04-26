# ModelOperationCapability

## Example Usage

```typescript
import { ModelOperationCapability } from "@compose-market/sdk/models";

let value: ModelOperationCapability = {
  modality: "image",
  operation: "<value>",
  sourceTypes: [],
  input: [
    "<value 1>",
    "<value 2>",
  ],
  output: [],
  pricingUnits: [],
  streamable: false,
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `modality`                                                  | [models.CanonicalModality](../models/canonical-modality.md) | :heavy_check_mark:                                          | N/A                                                         |
| `operation`                                                 | *string*                                                    | :heavy_check_mark:                                          | N/A                                                         |
| `sourceTypes`                                               | *string*[]                                                  | :heavy_check_mark:                                          | N/A                                                         |
| `input`                                                     | *string*[]                                                  | :heavy_check_mark:                                          | N/A                                                         |
| `output`                                                    | *string*[]                                                  | :heavy_check_mark:                                          | N/A                                                         |
| `pricingUnits`                                              | [models.PricingUnit](../models/pricing-unit.md)[]           | :heavy_check_mark:                                          | N/A                                                         |
| `streamable`                                                | *boolean*                                                   | :heavy_check_mark:                                          | N/A                                                         |
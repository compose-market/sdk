# ModalityOperationModelsListRequest

## Example Usage

```typescript
import { ModalityOperationModelsListRequest } from "@compose-market/sdk/models/operations";

let value: ModalityOperationModelsListRequest = {
  modality: "text",
  operation: "<value>",
};
```

## Fields

| Field                                                          | Type                                                           | Required                                                       | Description                                                    |
| -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------- |
| `modality`                                                     | [models.CanonicalModality](../../models/canonical-modality.md) | :heavy_check_mark:                                             | N/A                                                            |
| `operation`                                                    | *string*                                                       | :heavy_check_mark:                                             | N/A                                                            |
| `q`                                                            | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `provider`                                                     | [models.ModelProvider](../../models/model-provider.md)         | :heavy_minus_sign:                                             | N/A                                                            |
| `streaming`                                                    | *boolean*                                                      | :heavy_minus_sign:                                             | N/A                                                            |
| `cursor`                                                       | *string*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
| `limit`                                                        | *number*                                                       | :heavy_minus_sign:                                             | N/A                                                            |
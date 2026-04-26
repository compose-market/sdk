# InferenceEmbeddingsCreateRequest

## Example Usage

```typescript
import { InferenceEmbeddingsCreateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceEmbeddingsCreateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Fortwo",
    input: [
      "<value 1>",
      "<value 2>",
      "<value 3>",
    ],
  },
};
```

## Fields

| Field                                                                       | Type                                                                        | Required                                                                    | Description                                                                 | Example                                                                     |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                       | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         | 0x1111111111111111111111111111111111111111                                  |
| `xChainId`                                                                  | *number*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         |                                                                             |
| `xX402MaxAmountWei`                                                         | *string*                                                                    | :heavy_minus_sign:                                                          | N/A                                                                         | 1000000                                                                     |
| `body`                                                                      | [models.EmbeddingsCreateRequest](../../models/embeddings-create-request.md) | :heavy_check_mark:                                                          | N/A                                                                         |                                                                             |
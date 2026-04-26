# InferenceResponsesCreateRequest

## Example Usage

```typescript
import { InferenceResponsesCreateRequest } from "@compose-market/sdk/models/operations";

let value: InferenceResponsesCreateRequest = {
  xSessionUserAddress: "0x1111111111111111111111111111111111111111",
  xX402MaxAmountWei: "1000000",
  body: {
    model: "Focus",
    input: "<value>",
  },
};
```

## Fields

| Field                                                                     | Type                                                                      | Required                                                                  | Description                                                               | Example                                                                   |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `xSessionUserAddress`                                                     | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       | 0x1111111111111111111111111111111111111111                                |
| `xChainId`                                                                | *number*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `xX402MaxAmountWei`                                                       | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       | 1000000                                                                   |
| `xIdempotencyKey`                                                         | *string*                                                                  | :heavy_minus_sign:                                                        | N/A                                                                       |                                                                           |
| `body`                                                                    | [models.ResponsesCreateRequest](../../models/responses-create-request.md) | :heavy_check_mark:                                                        | N/A                                                                       |                                                                           |
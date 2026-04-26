# ModelParamsResponse

## Example Usage

```typescript
import { ModelParamsResponse } from "@compose-market/sdk/models";

let value: ModelParamsResponse = {
  modelId: "<id>",
  params: {
    "key": {},
    "key1": {},
  },
  defaults: {},
};
```

## Fields

| Field                                 | Type                                  | Required                              | Description                           |
| ------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------- |
| `modelId`                             | *string*                              | :heavy_check_mark:                    | N/A                                   |
| `type`                                | *string*                              | :heavy_minus_sign:                    | N/A                                   |
| `provider`                            | *string*                              | :heavy_minus_sign:                    | N/A                                   |
| `params`                              | Record<string, Record<string, *any*>> | :heavy_check_mark:                    | N/A                                   |
| `defaults`                            | Record<string, *any*>                 | :heavy_check_mark:                    | N/A                                   |
# VerifyResponse

## Example Usage

```typescript
import { VerifyResponse } from "@compose-market/sdk/models";

let value: VerifyResponse = {
  isValid: true,
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `isValid`          | *boolean*          | :heavy_check_mark: | N/A                |
| `invalidReason`    | *string*           | :heavy_minus_sign: | N/A                |
| `invalidMessage`   | *string*           | :heavy_minus_sign: | N/A                |
| `payer`            | *string*           | :heavy_minus_sign: | N/A                |
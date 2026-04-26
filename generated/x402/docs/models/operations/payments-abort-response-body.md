# PaymentsAbortResponseBody

Payment intent abort result.

## Example Usage

```typescript
import { PaymentsAbortResponseBody } from "@compose-market/sdk/models/operations";

let value: PaymentsAbortResponseBody = {
  success: false,
  paymentIntentId: "<id>",
};
```

## Fields

| Field              | Type               | Required           | Description        |
| ------------------ | ------------------ | ------------------ | ------------------ |
| `success`          | *boolean*          | :heavy_check_mark: | N/A                |
| `paymentIntentId`  | *string*           | :heavy_check_mark: | N/A                |
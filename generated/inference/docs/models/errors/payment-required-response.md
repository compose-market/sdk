# PaymentRequiredResponse

x402 payment challenge.


## Supported Types

### `errors.PaymentRequiredError`

```typescript
const value: errors.PaymentRequiredError = {
  x402Version: 2,
  resource: {
    url: "https://expert-entry.org/",
  },
  accepts: [],
};
```

### `errors.ErrorEnvelope`

```typescript
const value: errors.ErrorEnvelope = {
  error: {
    code: "<value>",
    message: "<value>",
  },
};
```


# FeedbackSubmitRequestUnion


## Supported Types

### `models.FeedbackSubmitRequest1`

```typescript
const value: models.FeedbackSubmitRequest1 = {
  target: {
    type: "workflow",
    id: "<id>",
  },
  rating: 322902,
  context: {
    agentWallet: "0x1111111111111111111111111111111111111111",
    receipt: {
      network: "eip155:43113",
      finalAmountWei: "1000000",
    },
  },
};
```

### `models.FeedbackSubmitRequest2`

```typescript
const value: models.FeedbackSubmitRequest2 = {
  target: {
    type: "workflow",
    id: "<id>",
  },
  message: "<value>",
  context: {
    agentWallet: "0x1111111111111111111111111111111111111111",
    receipt: {
      network: "eip155:43113",
      finalAmountWei: "1000000",
    },
  },
};
```


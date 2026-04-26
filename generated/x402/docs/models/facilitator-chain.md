# FacilitatorChain

## Example Usage

```typescript
import { FacilitatorChain } from "@compose-market/sdk/models";

let value: FacilitatorChain = {
  chainId: 722183,
  name: "<value>",
  network: "eip155:43113",
  isTestnet: false,
  usdcAddress: "0x1111111111111111111111111111111111111111",
  x402UptoPermit2Proxy: "0x1111111111111111111111111111111111111111",
  schemes: [],
  asset: "USDC",
  decimals: 6,
};
```

## Fields

| Field                                                                    | Type                                                                     | Required                                                                 | Description                                                              | Example                                                                  |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `chainId`                                                                | *number*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
| `name`                                                                   | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
| `network`                                                                | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      | eip155:43113                                                             |
| `shortName`                                                              | *string*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      |                                                                          |
| `isTestnet`                                                              | *boolean*                                                                | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
| `explorer`                                                               | *string*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      |                                                                          |
| `usdcAddress`                                                            | *string*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      | 0x1111111111111111111111111111111111111111                               |
| `x402UptoPermit2Proxy`                                                   | *string*                                                                 | :heavy_minus_sign:                                                       | N/A                                                                      | 0x1111111111111111111111111111111111111111                               |
| `schemes`                                                                | [models.FacilitatorChainScheme](../models/facilitator-chain-scheme.md)[] | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
| `asset`                                                                  | *"USDC"*                                                                 | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
| `decimals`                                                               | *6*                                                                      | :heavy_check_mark:                                                       | N/A                                                                      |                                                                          |
# FacilitatorChainsResponse

## Example Usage

```typescript
import { FacilitatorChainsResponse } from "@compose-market/sdk/models";

let value: FacilitatorChainsResponse = {
  chains: [
    {
      chainId: 279016,
      name: "<value>",
      network: "eip155:43113",
      isTestnet: true,
      usdcAddress: "0x1111111111111111111111111111111111111111",
      x402UptoPermit2Proxy: "0x1111111111111111111111111111111111111111",
      schemes: [
        "upto",
      ],
      asset: "USDC",
      decimals: 6,
    },
  ],
  defaultChainId: 137149,
};
```

## Fields

| Field                                                       | Type                                                        | Required                                                    | Description                                                 |
| ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- | ----------------------------------------------------------- |
| `chains`                                                    | [models.FacilitatorChain](../models/facilitator-chain.md)[] | :heavy_check_mark:                                          | N/A                                                         |
| `defaultChainId`                                            | *number*                                                    | :heavy_check_mark:                                          | N/A                                                         |
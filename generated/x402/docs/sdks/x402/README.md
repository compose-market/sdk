# X402

## Overview

### Available Operations

* [x402Supported](#x402supported)
* [x402ChainsList](#x402chainslist)
* [x402PaymentVerify](#x402paymentverify)
* [x402PaymentSettle](#x402paymentsettle)

## x402Supported

### Example Usage

<!-- UsageSnippet language="typescript" operationID="x402_supported" method="get" path="/api/x402/facilitator/supported" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.x402.x402Supported();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { x402X402Supported } from "@compose-market/sdk/funcs/x402-x402-supported.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await x402X402Supported(composeMarket);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("x402X402Supported failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.X402SupportedResponse](../../models/operations/x402-supported-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## x402ChainsList

### Example Usage

<!-- UsageSnippet language="typescript" operationID="x402_chains_list" method="get" path="/api/x402/facilitator/chains" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.x402.x402ChainsList();

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { x402X402ChainsList } from "@compose-market/sdk/funcs/x402-x402-chains-list.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await x402X402ChainsList(composeMarket);
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("x402X402ChainsList failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.X402ChainsListResponse](../../models/operations/x402-chains-list-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## x402PaymentVerify

### Example Usage

<!-- UsageSnippet language="typescript" operationID="x402_payment_verify" method="post" path="/api/x402/facilitator/verify" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.x402.x402PaymentVerify({
    x402Version: 2,
    paymentPayload: {
      x402Version: 2,
      accepted: {
        scheme: "exact",
        network: "eip155:43113",
        amount: "1000000",
        asset: "0x1111111111111111111111111111111111111111",
        payTo: "0x1111111111111111111111111111111111111111",
        maxTimeoutSeconds: 57667,
      },
      payload: "<value>",
    },
    paymentRequirements: {
      scheme: "exact",
      network: "eip155:43113",
      amount: "1000000",
      asset: "0x1111111111111111111111111111111111111111",
      payTo: "0x1111111111111111111111111111111111111111",
      maxTimeoutSeconds: 167169,
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { x402X402PaymentVerify } from "@compose-market/sdk/funcs/x402-x402-payment-verify.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await x402X402PaymentVerify(composeMarket, {
    x402Version: 2,
    paymentPayload: {
      x402Version: 2,
      accepted: {
        scheme: "exact",
        network: "eip155:43113",
        amount: "1000000",
        asset: "0x1111111111111111111111111111111111111111",
        payTo: "0x1111111111111111111111111111111111111111",
        maxTimeoutSeconds: 57667,
      },
      payload: "<value>",
    },
    paymentRequirements: {
      scheme: "exact",
      network: "eip155:43113",
      amount: "1000000",
      asset: "0x1111111111111111111111111111111111111111",
      payTo: "0x1111111111111111111111111111111111111111",
      maxTimeoutSeconds: 167169,
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("x402X402PaymentVerify failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [models.FacilitatorPaymentRequest](../../models/facilitator-payment-request.md)                                                                                                | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.X402PaymentVerifyResponse](../../models/operations/x402-payment-verify-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## x402PaymentSettle

### Example Usage

<!-- UsageSnippet language="typescript" operationID="x402_payment_settle" method="post" path="/api/x402/facilitator/settle" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.x402.x402PaymentSettle({
    x402Version: 2,
    paymentPayload: {
      x402Version: 2,
      accepted: {
        scheme: "upto",
        network: "eip155:43113",
        amount: "1000000",
        asset: "0x1111111111111111111111111111111111111111",
        payTo: "0x1111111111111111111111111111111111111111",
        maxTimeoutSeconds: 159289,
      },
      payload: "<value>",
    },
    paymentRequirements: {
      scheme: "upto",
      network: "eip155:43113",
      amount: "1000000",
      asset: "0x1111111111111111111111111111111111111111",
      payTo: "0x1111111111111111111111111111111111111111",
      maxTimeoutSeconds: 524750,
    },
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { x402X402PaymentSettle } from "@compose-market/sdk/funcs/x402-x402-payment-settle.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await x402X402PaymentSettle(composeMarket, {
    x402Version: 2,
    paymentPayload: {
      x402Version: 2,
      accepted: {
        scheme: "upto",
        network: "eip155:43113",
        amount: "1000000",
        asset: "0x1111111111111111111111111111111111111111",
        payTo: "0x1111111111111111111111111111111111111111",
        maxTimeoutSeconds: 159289,
      },
      payload: "<value>",
    },
    paymentRequirements: {
      scheme: "upto",
      network: "eip155:43113",
      amount: "1000000",
      asset: "0x1111111111111111111111111111111111111111",
      payTo: "0x1111111111111111111111111111111111111111",
      maxTimeoutSeconds: 524750,
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("x402X402PaymentSettle failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [models.FacilitatorPaymentRequest](../../models/facilitator-payment-request.md)                                                                                                | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.X402PaymentSettleResponse](../../models/operations/x402-payment-settle-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |
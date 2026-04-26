# Payments

## Overview

### Available Operations

* [paymentsPrepare](#paymentsprepare)
* [paymentsSettle](#paymentssettle)
* [paymentsAbort](#paymentsabort)
* [paymentsModelMeter](#paymentsmodelmeter)

## paymentsPrepare

### Example Usage

<!-- UsageSnippet language="typescript" operationID="payments_prepare" method="post" path="/api/payments/prepare" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket();

async function run() {
  const result = await composeMarket.payments.paymentsPrepare({
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      service: "<value>",
      action: "<value>",
      resource: "<value>",
      maxAmountWei: "1000000",
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
import { paymentsPaymentsPrepare } from "@compose-market/sdk/funcs/payments-payments-prepare.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore();

async function run() {
  const res = await paymentsPaymentsPrepare(composeMarket, {
    composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
  }, {
    xSessionUserAddress: "0x1111111111111111111111111111111111111111",
    xX402MaxAmountWei: "1000000",
    body: {
      service: "<value>",
      action: "<value>",
      resource: "<value>",
      maxAmountWei: "1000000",
    },
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("paymentsPaymentsPrepare failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.PaymentsPrepareRequest](../../models/operations/payments-prepare-request.md)                                                                                       | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `security`                                                                                                                                                                     | [operations.PaymentsPrepareSecurity](../../models/operations/payments-prepare-security.md)                                                                                     | :heavy_check_mark:                                                                                                                                                             | The security requirements to use for the request.                                                                                                                              |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PaymentsPrepareResponse](../../models/operations/payments-prepare-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.PaymentRequiredError      | 402                              | application/json                 |
| errors.ErrorEnvelope             | 402                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## paymentsSettle

### Example Usage

<!-- UsageSnippet language="typescript" operationID="payments_settle" method="post" path="/api/payments/settle" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.payments.paymentsSettle({
    paymentIntentId: "<id>",
    finalAmountWei: "1000000",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { paymentsPaymentsSettle } from "@compose-market/sdk/funcs/payments-payments-settle.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await paymentsPaymentsSettle(composeMarket, {
    paymentIntentId: "<id>",
    finalAmountWei: "1000000",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("paymentsPaymentsSettle failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.PaymentsSettleRequest](../../models/operations/payments-settle-request.md)                                                                                         | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PaymentsSettleResponse](../../models/operations/payments-settle-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## paymentsAbort

### Example Usage

<!-- UsageSnippet language="typescript" operationID="payments_abort" method="post" path="/api/payments/abort" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.payments.paymentsAbort({
    paymentIntentId: "<id>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { paymentsPaymentsAbort } from "@compose-market/sdk/funcs/payments-payments-abort.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await paymentsPaymentsAbort(composeMarket, {
    paymentIntentId: "<id>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("paymentsPaymentsAbort failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [operations.PaymentsAbortRequest](../../models/operations/payments-abort-request.md)                                                                                           | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PaymentsAbortResponse](../../models/operations/payments-abort-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |

## paymentsModelMeter

### Example Usage

<!-- UsageSnippet language="typescript" operationID="payments_model_meter" method="post" path="/api/payments/meter/model" -->
```typescript
import { ComposeMarket } from "@compose-market/sdk";

const composeMarket = new ComposeMarket({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const result = await composeMarket.payments.paymentsModelMeter({
    modelId: "<id>",
    modality: "<value>",
  });

  console.log(result);
}

run();
```

### Standalone function

The standalone function version of this method:

```typescript
import { ComposeMarketCore } from "@compose-market/sdk/core.js";
import { paymentsPaymentsModelMeter } from "@compose-market/sdk/funcs/payments-payments-model-meter.js";

// Use `ComposeMarketCore` for best tree-shaking performance.
// You can create one instance of it to use across an application.
const composeMarket = new ComposeMarketCore({
  composeKeyAuth: "<YOUR_BEARER_TOKEN_HERE>",
});

async function run() {
  const res = await paymentsPaymentsModelMeter(composeMarket, {
    modelId: "<id>",
    modality: "<value>",
  });
  if (res.ok) {
    const { value: result } = res;
    console.log(result);
  } else {
    console.log("paymentsPaymentsModelMeter failed:", res.error);
  }
}

run();
```

### Parameters

| Parameter                                                                                                                                                                      | Type                                                                                                                                                                           | Required                                                                                                                                                                       | Description                                                                                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `request`                                                                                                                                                                      | [models.ModelMeterRequest](../../models/model-meter-request.md)                                                                                                                | :heavy_check_mark:                                                                                                                                                             | The request object to use for the request.                                                                                                                                     |
| `options`                                                                                                                                                                      | RequestOptions                                                                                                                                                                 | :heavy_minus_sign:                                                                                                                                                             | Used to set various options for making HTTP requests.                                                                                                                          |
| `options.fetchOptions`                                                                                                                                                         | [RequestInit](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options)                                                                                        | :heavy_minus_sign:                                                                                                                                                             | Options that are passed to the underlying HTTP request. This can be used to inject extra headers for examples. All `Request` options, except `method` and `body`, are allowed. |
| `options.retries`                                                                                                                                                              | [RetryConfig](../../lib/utils/retryconfig.md)                                                                                                                                  | :heavy_minus_sign:                                                                                                                                                             | Enables retrying HTTP requests under certain failure conditions.                                                                                                               |

### Response

**Promise\<[operations.PaymentsModelMeterResponse](../../models/operations/payments-model-meter-response.md)\>**

### Errors

| Error Type                       | Status Code                      | Content Type                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| errors.ErrorEnvelope             | 400                              | application/json                 |
| errors.LegacyError               | 400                              | application/json                 |
| errors.ComposeMarketDefaultError | 4XX, 5XX                         | \*/\*                            |